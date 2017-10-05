var fs = require('fs'),
    _fetched = false,
    _location = process.cwd().replace(/\\/g,'/').replace(/(\/node_modules.+)/g,'')+'/.paprika/tasks',
    _tasks = [];

function local()
{
    var _obj = {};
    _obj.location = (location ? local.fetch(location) : _location);
    _obj.fetched = _fetched;
    _obj.tasks = _tasks.slice();
    
    return _obj;
}

local.fetch = function(location)
{
    try{
        _tasks = fs.readdirSync(location ? location : _location);
    }
    catch(e)
    {
        _tasks = [];
    }
    
    return local;
}

local.fetched = function()
{
    return _fetched;
}

module.exports = local;