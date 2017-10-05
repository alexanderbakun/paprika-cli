var fs = require('fs'),
    _checked = false,
    _location = process.cwd().replace(/\\/g,'/').replace(/(\/node_modules.+)/g,'')+'/.paprika',
    _init = false;

function init(location)
{
    var _obj = {};
    _obj.location = (location ? init.check(location) : _location);
    _obj.init = _init;
    _obj.checked = _checked;
    
    return _obj;
}

init.check = function(location)
{
    try{
        fs.readdirSync(location ? location : _location);
        _init = true;
        _checked = true;
    }
    catch(e)
    {
        _init = false;
        _checked = false;
    }
}

init.checked = function()
{
    return _checked;
}

init.init = function(v)
{
    if(typeof v === undefined) return _init;
    _init = !!v;
    return init;
}

module.exports = init;