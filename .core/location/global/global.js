var _module = __dirname.replace(/\\/g,'/').replace('/.core/location/global',''),
    _base = _module + '/src',
    _tasks = _base + '/.tasks',
    _templates = _base + '/.templates';

function global(module, base, tasks, templates)
{
    var _obj = {};
    _obj.module = (module ? global.module(module).module() : global.module());
    _obj.base = (base ? global.base(base).base() : global.base());
    _obj.tasks = (tasks ? global.tasks(tasks).tasks() : global.tasks());
    _obj.templates = (templates ? global.templates(templates).templates() : global.templates());
    return _obj;
}

global.module = function(v)
{
    if(v === undefined) return _module;
    _module = (typeof v === 'string' ? v : _module);
    return global;
}

global.base = function(v)
{
    if(v === undefined) return _base;
    _base = (typeof v === 'string' ? v : _base);
    return global;
}

global.tasks = function(v)
{
    if(v === undefined) return _tasks;
    _tasks = (typeof v === 'string' ? v : _tasks);
    return global;
}

global.templates = function(v)
{
    if(v === undefined) return _templates;
    _templates = (typeof v === 'string' ? v : _templates);
    return global;
}

module.exports = global;