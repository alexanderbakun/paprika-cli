var _task = require('./task/task'),
    _rules = require('./rules/rules'),
    _params = require('./params/params'),
    _argv;

function argv(task,rules,params)
{
    var _obj = {};
    _obj.task = (task ? argv.task(task).task() : argv.task());
    _obj.rules = (rules ? argv.rules(rules).rules() : argv.rules());
    _obj.params = (params ? argv.params(params).params() : argv.params());
    _obj.argv = _argv;
    
    return _obj;
}

argv.parse = function(argv)
{
    if(!argv.argv()) argv.argv(argv.slice(argv.indexOf('paprika'),argv.length));
    
    if(!_task.task()) _task.parse(argv);
    
    var _argv = argv.slice(argv.indexOf('paprika')+2,argv.length),
        _param;
    for(var x=0,len=_argv.length,_arg;x<len;x++)
    {
        _arg = _argv[x];
        if(!_param && _arg.indexOf('-') === -1)
        {
            _rules.create(_arg);
        }
        else if(!_param && _arg.indexOf('-') !== -1)
        {
            _param = _arg;
        }
        else if(_param)
        {
            _params.create(_param,(_arg.indexOf(',') !== -1 ? _arg.split(',') : _arg));
            _param = undefined;
        }
    }
    
    return argv;
}

argv.argv = function(v)
{
    if(v === undefined) return _argv;
    _argv = (typeof v === 'object' ? v : _argv);
    return argv;
}

argv.task = function(v)
{
    if(v === undefined) return _task;
    _task = (v.toString() === _task.toString() ? v : _task);
    return argv;
}

argv.rules = function(v)
{
    if(v === undefined) return _rules;
    _rules = (v.toString() === _rules.toString() ? v : _rules);
    return argv;
}

argv.params = function(v)
{
    if(v === undefined) return _params;
    _params = (v.toString() === _params.toString() ? v : _params);
    return argv;
}

module.exports = argv;