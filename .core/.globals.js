var fs = require('fs'),
    params = require('./.params'),
    core = require('./.core');

function globals()
{
  /* run .core file after all globals have been setup */
  core();
}

globals.set = function()
{
  /* set up paprika globals */
  global.paprika = {};

  /* location object */
  global.paprika.location = {};
  
  /* This is the location in relation to your project */
  global.paprika.location.local = process.cwd().replace(/\\/g,'/').replace(/(\/node_modules.+)/g,'');
  global.paprika.location.local_tasks = {
    base: paprika.location.local+'/.paprika',
    tasks: paprika.location.local+'/.paprika/tasks',
    templates:paprika.location.local+'/.paprika/templates'
  }
  
  /* This is the location in relation to the module itself */
  global.paprika.location.module = __dirname.replace(/\\/g,'/').replace('/.core','');
  global.paprika.location.module_tasks = {
    base: paprika.location.module+'/src',
    tasks: paprika.location.module+'/src/.tasks',
    templates: paprika.location.module+'/src/.templates'
  }

  /* parse params */
  global.paprika.args = process.argv.slice(2,process.argv.length);
  global.paprika.params = params.args(paprika.args).call();
  
  /* remove process args except help and options */
  process.argv = process.argv.filter(function(v){
    return (v.indexOf('\\') !== -1 || v === '-h' || v === '--help' || v === '-o' || v === '--options');
  });

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
    global.paprika.tasks_local = [];
    global.paprika.init = false;
    /* maybe later add logging levels -- this would be a verbose log */
  }

  global.paprika.task = {}; 
  
  return globals;
}

globals.getTask = function()
{
  if(paprika.tasks_module.indexOf(paprika.params.task) !== -1)
  {
    /* get modules */
    global.paprika.task.method = require(paprika.location.module_tasks.tasks+'/'+paprika.params.task+'/'+paprika.params.task);
    global.paprika.task.config = require(paprika.location.module_tasks.tasks+'/'+paprika.params.task+'/'+paprika.params.task+'.config');
  }
  else if(paprika.tasks_local.indexOf(paprika.params.task) !== -1)
  {
    /* get modules */
    global.paprika.task.method = require(paprika.location.local_tasks.tasks+'/'+paprika.params.task+'/'+paprika.params.task);

    try
    {
      global.paprika.task.config = require(paprika.location.local_tasks.tasks+'/'+paprika.params.task+'/'+paprika.params.task+'.config');
    }
    catch(e)
    {
      console.error('There is no config that exists by the name of %o',paprika.params.task);
      process.exit(1);
    }
  }
  else
  {
    console.error('There is no task that exists by the name of %o',paprika.params.task);
    process.exit(1);
  }
  
  return globals;
}

globals.setMethods = function()
{
  global.paprika.loadConfig = function(url)
  {
    var config = require(url+'/config'),
        keys = Object.keys(config),
        localConfig = paprika.task.config,
        localKeys = Object.keys(localConfig);
    
    for(var x=0,len=localKeys.length,key;x<len;x++)
    {
      key = localKeys[x];
      if(typeof localConfig[key] === 'object') localConfig[key].baseCommand = true;
    }
    
    for(var x=0,len=keys.length,key;x<len;x++)
    {
      key = keys[x];
      paprika.task.config[key] = config[key];
    }
    return global.paprika;
  }
  
  global.paprika.showHelp = function()
  {
    var _params = ['-o','--option','-h','--help'];
    for(var x = 0,len=process.argv.length;x<len;x++)
    {
      if(_params.indexOf(process.argv[x]) !== -1)
      {
        core.showHelp();
        break;
      }
    }
    return global.paprika;
  }
  
  global.paprika.getFirstCommand = function()
  {
    var _taskName = '',
        _config = paprika.task.config,
        _keys = Object.keys(paprika.task.config).filter(function(v){return (typeof _config[v] === 'object');});
    if(_config.firstCommand)
    {
      _taskName = (typeof _config.firstCommand === 'function' ? _config.firstCommand() : _config.firstCommand);
      if(!_config[_taskName].baseCommand) return _taskName;
    }
    
    for(var x=0,len=_keys.length,_key;x<len;x++)
    {
      _key = _keys[x];
      if(!_config[_key].baseCommand) return _key;
    }
    return 'end';
  }
  
  return globals;
}

module.exports = globals;