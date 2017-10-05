var _params = {};

function params()
{
    var _obj = {},
        _keys = Object.keys(_params);
    
    for(var x=0,len=_keys.length,key;x<len;x++)
    {
        key = _keys[x];
        _obj[key] = _params[key];
    }
    
    return _obj;
}

params.create = function(key,value)
{
    if(['create','length'].indexOf(key) !== -1) return console.error('You can not use a param with the name --create or --length');
    
    var _value = value,
        _type = (typeof value);
    
    _params[key] = value;
    params[key] = function(v)
    {
        if(v === undefined) return _value;
        _value = (typeof v === _type ? v : _value);
        _params[key] = (typeof v === _type ? v : _value);
        return params;
    }
    
    return params;
}

module.exports = params;