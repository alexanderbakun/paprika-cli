var _module = process.cwd().replace(/\\/g,'/').replace(/(\/node_modules.+)/g,''),
    _base = _module + '/.paprika',
    _tasks = _base + '/tasks',
    _templates = _base + '/templates';

function local(module,base,tasks,templates)
{
    var _obj = {};
    _obj.module = (module ? local.module(module).module() : local.module());
    _obj.base = (base ? local.base(base).base() : local.base());
    _obj.tasks = (tasks ? local.tasks(tasks).tasks() : local.tasks());
    _obj.templates = (templates ? local.templates(templates).templates() : local.templates());
    return _obj;
}

local.module = function(v)
{
    if(v === undefined) return _module;
    _module = (typeof v === 'string' ? v : _module);
    return local;
}

local.base = function(v)
{
    if(v === undefined) return _base;
    _base = (typeof v === 'string' ? v : _base);
    return local;
}

local.tasks = function(v)
{
    if(v === undefined) return _tasks;
    _tasks = (typeof v === 'string' ? v : _tasks);
    return local;
}

local.templates = function(v)
{
    if(v === undefined) return _templates;
    _templates = (typeof v === 'string' ? v : _templates);
    return location;
}

module.exports = local;