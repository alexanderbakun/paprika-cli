#!/usr/bin/env node

'use strict';

var fs = require('fs'),
    core = require('./../.core/.core'),
    params = require('./../.core/.params');
    

process.on('unhandledRejection', function (err) {
  console.error('unhandledRejection',err.message,err.stack);
});

/* set up paprika globals */
global.paprika = {};

/* location object */
global.paprika.location = {};
global.paprika.location.local = process.cwd().replace(/\\/g,'/').replace(/(\/node_modules.+)/g,'');
global.paprika.location.local_tasks = {
  base: global.paprika.location.local+'/.paprika',
  configs: global.paprika.location.local+'/.paprika/.configs',
  tasks: global.paprika.location.local+'/.paprika/.tasks',
  templates:global.paprika.location.local+'/.paprika/.templates'
}
global.paprika.location.module = __dirname.replace(/\\/g,'/').replace('/bin','');
global.paprika.location.module_tasks = {
  base: global.paprika.location.module+'/src',
  configs: global.paprika.location.module+'/src/.configs',
  tasks: global.paprika.location.module+'/src/.tasks',
  templates: global.paprika.location.module+'/templates'
}

/* parse params */
global.paprika.args = process.argv.slice(2,process.argv.length);
global.paprika.params = params(paprika.args);

/* config */
global.paprika.config = require(paprika.location.module_tasks.configs+'/config');

/* task names from module */
global.paprika.tasks_module = fs.readdirSync(paprika.location.module_tasks.tasks);

try
{
  global.paprika.tasks_local = fs.readdirSync(paprika.location.local_tasks.tasks);
  for(var x=0,len=paprika.tasks_module;x<len;x++)
  {
    if(paprika.tasks_local.indexOf(paprika.tasks_module[x]) !== -1) paprika.tasks_module.splice(x,1);
  }
}
catch(e)
{
  /* maybe later add logging levels -- this would be a verbose log */
}

global.paprika.task = {};
if(paprika.tasks_module.indexOf(paprika.params.task) !== -1)
{
  /* get modules */
  global.paprika.task.method = require(paprika.location.module_tasks.tasks+'/'+paprika.params.task+'/'+paprika.params.task);
  global.paprika.task.config = require(paprika.location.module_tasks.configs+'/'+paprika.params.task+'/'+paprika.params.task);
  
  /* run .core file after all globals have been setup */
  core(global.paprika.task);
}
else if(global.paprika.tasks_local.indexOf(paprika.params.task) !== -1)
{
  /* get modules */
  global.paprika.task.method = require(paprika.location.local_tasks.tasks+'/'+paprika.params.task+'/'+paprika.params.task);
  
  try
  {
    global.paprika.task.config = require(paprika.location.local_tasks.config+'/'+paprika.params.task+'/'+paprika.params.task);
  }
  catch(e)
  {
    console.error('There is no config that exists by the name of %o',paprika.params.task);
    process.exit(1);
  }
  
  /* run .core file after all globals have been setup */
  core(global.paprika.task);
}
else
{
  console.error('There is no task that exists by the name of %o',paprika.params.task);
  process.exit(1);
}