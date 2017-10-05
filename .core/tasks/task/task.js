var fs = require('fs'),
    _fetched = false,
    _title = '',
    _location = __dirname.replace(/\\/g,'/').replace('/.core/tasks/global','')+'/src/.tasks',
    _default = function(){console.error('No task is currently set to run')},
    _task = _default;

function task(title, location)
{ 
    var _obj = {};
    _obj.title = (title ? task.title(title).title() : task.title());
    _obj.location = (location ? task.location(location).location() : task.location());
    _obj.task = (title || location ? task.fetch().task() : task.task());
    _obj.fetched = _fetched;
    _obj.default = _default;
    
    return _obj;
}

task.fetch = function(title, location)
{
    title = (title ? task.title(title).title() : task.title());
    location = (location ? task.location(location).location() : task.location());
    
    try{
        _task = require(location + '/' + title);
        if(_task && _task.toString() !== _default.toString()) _fetched = true;
    }
    catch(e)
    {
        console.error('There is no task that exists by the name of %o',location + '/' + title);
    }
    
    return task;
}

task.location = function(v)
{
    if(v === undefined) return _location;
    try{
        _location = (typeof v === 'string' && fs.statSync(v).isDirectory() ? v : _location);
    }
    catch(e){};
    
    return task;
}

task.title = function(v)
{
    if(v === undefined) return _title;
    _title = (typeof v === 'string' ? v : _title);
    return task;
}

task.task = function(v)
{
    if(v === undefined) return _task;
    _task = (typeof v === 'function' ? v : _task);
    if(_task && _task.toString() !== _default.toString()) _fetched = true;
    return task;
}

module.exports = task;