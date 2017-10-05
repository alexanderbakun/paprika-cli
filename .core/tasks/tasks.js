var _global = require('./global/global'),
    _local = require('./local/local'),
    _init = require('./init/init'),
    _task = require('./task/task'),
    _config = require('./config/config'),

function tasks(title,local,global)
{
    
    var _obj = {};
    _obj.tasks = tasks.tasks(local,global);
    _obj.init = _init();
    
    if(title) tasks.fetch(title);
    
    _obj.task = tasks.task();
    _obj.config = tasks.config();
    
    return _obj;
}

tasks.fetch = function(title,local,global)
{
    title = (typeof title === 'string' ? title : _task.title());
    local = (typeof local === 'string' ? tasks.local(local).call().location : tasks.local().location);
    global = (typeof local === 'string' ? tasks.global(global).call().location : tasks.global().location);
    
    tasks.task(title)
    .config(title);
    
    return tasks;
}

tasks.tasks = function(local,global)
{
    local = (typeof local === 'string' ? tasks.local(local).call() : tasks.local());
    global = (typeof local === 'string' ? tasks.global(global).call().location : tasks.global());
    
    return {global:global,local:local};
}

tasks.global = function(v)
{
    if(v === undefined) return _global();
    if(typeof v === 'string') _global.fetch(v);
    return tasks;
}

tasks.local = function(v)
{
    if(v === undefined) return _local();
    if(typeof v === 'string') _local.fetch(v);
    return tasks;
}

tasks.init = function(v)
{
    if(v === undefined) return _local();
    if(typeof v === 'string') _init.check(v);
    return tasks;
}

tasks.task = function(v)
{
    if(v === undefined) return _task();
    if(typeof v === 'string')
    {
        _task.fetch(v,(tasks.local().indexOf(v) !== -1 ? _local.location() : (_global.location())));
    }
    else if(typeof v === 'function')
    {
        _task.task(v);
    }
    return tasks;
}

tasks.config = function(v)
{
    if(v === undefined) return _task();
    if(typeof v === 'string')
    {
        _config.fetch(v,(tasks.local().indexOf(v) !== -1 ? _local.location() : (_global.location())));
    }
    else if(typeof v === 'object')
    {
        _config.config(v);
    }
    return tasks;
}

module.exports = tasks;