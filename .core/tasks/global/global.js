var fs = require('fs'),
    _fetched = false,
    _location = __dirname.replace(/\\/g,'/').replace('/.core/tasks/global','')+'/src/.tasks',
    _tasks = [];

function global(location)
{
    var _obj = {};
    _obj.location = (location ? global.fetch(location) : _location);
    _obj.fetched = _fetched;
    _obj.tasks = _tasks.slice();
    
    return _obj;
}

global.fetch = function(location)
{
    try{
        _tasks = fs.readdirSync(location ? location : _location);
    }
    catch(e)
    {
        _tasks = [];
        console.error('An error has occurred, no node module tasks were found at ',(location ? location : _location),', there is an issue with your install');
    }
    
    return global;
}

global.fetched = function()
{
    return _fetched;
}

module.exports = global;