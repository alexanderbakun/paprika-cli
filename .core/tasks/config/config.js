var fs = require('fs'),
    _fetched = false,
    _title = '',
    _location = __dirname.replace(/\\/g,'/').replace('/.core/tasks/global','')+'/src/.tasks',
    _default = {},
    _config = _default;

function config()
{
    var _obj = {};
    _obj.title = (title ? config.title(title).title() : config.title());
    _obj.location = (location ? config.location(location).location() : config.location());
    _obj.config = (title || location ? config.fetch().config() : config.config());
    _obj.fetched = _fetched;
    _obj.default = _default;
    
    return _obj;
}

config.fetch = function(title,location)
{
    title = (title ? config.title(title).title() : config.title());
    location = (location ? config.location(location).location() : config.location());
    
    _config = require(location + '/'+title+'.config');
    if(_config && _config !== _default) _fetched = true;
    
    return task;
}

config.location = function(v)
{
    if(v === undefined) return _location;
    try{
        _location = (typeof v === 'string' && fs.statSync(v).isDirectory() ? v : _location);
    }
    catch(e){};
    
    return config;
}

config.title = function(v)
{
    if(v === undefined) return _title;
    _title = (typeof v === 'string' ? v : _title);
    return config;
}

config.config = function(v)
{
    if(v === undefined) return _config;
    _config = (typeof v === 'object' ? v : _config);
    if(_config && _config !== _default) _fetched = true;
    return config;
}

module.exports = config;