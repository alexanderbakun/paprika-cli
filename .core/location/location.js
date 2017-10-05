var _global = require('./global/global'),
    _local = require('./local/local');

function location(global,local)
{
    var _obj = {};
    _obj.global = (global ? location.global(global).global() : location.global());
    _obj.local = (local ? location.local(local).local() : location.local());
    
    return _obj;
}

location.global = function(v)
{
    if(v === undefined) return _global;
    _global = (v.toString() === _global.toString() ? v : _global);
    return location;
}

location.local = function(v)
{
    if(v === undefined) return _local;
    _local = (v.toString() === _local.toString() ? v : _local);
    return location;
}

module.exports = location;