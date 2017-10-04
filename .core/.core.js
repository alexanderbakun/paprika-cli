/*****
 *   Core
 *   This files functionality is to be a base handler for prompts and cli inputs that get given to the task
 *   Created by Keleko34
 *****/

/*
   Things we need to allow for:
   _values = {}
   cmd {short, long, help} | function
   prompt {message 'string' | function
   type enum | function
   choices [] | function
   action ('end' | 'exit' | actionname) | function
   storage (value | array) | function
   filter function
   onaction function}
   firstCommand string | function
*/

var inquirer = require('inquirer');

var _task,
    /* _taskOptions = paprika.task.config, */
    _currentTask = '',
    _values = {};

function core()
{
  var _taskOptions = paprika.task.config,
      _keys = Object.keys(_taskOptions).filter(function(v){
        return (typeof _taskOptions[v] === 'object' && _taskOptions[v].cmd !== undefined && _taskOptions[v].prompt !== undefined)
      });
  
  if(_taskOptions.init && !paprika.init)
  {
    console.error('\033[31mThis task requires you to have initialized "paprika init" command first and installed local files into the project\033[37m');
    process.exit(1);
  }
  
  _currentTask = (typeof _taskOptions.firstCommand === 'function' ? _taskOptions.firstCommand() : (_taskOptions.firstCommand || _keys[0]));
  
  if(_taskOptions[_currentTask].baseCommand)
  {
    var found = false;
    for(var x=0,len=_keys.length;x<len;x++)
    {
      if(!_taskOptions[_keys[x]].baseCommand)
      {
        found = true;
        _currentTask = _keys[x];
        break;
      }
    }
    if(!found) _currentTask = 'end';
  }
  
  /* sort cli helper */
  core.showHelp()
  .runCommand(_currentTask, _taskOptions[_currentTask]);
}

core.showHelp = function()
{
  var _taskOptions = paprika.task.config,
      _keys = Object.keys(_taskOptions).filter(function(v){
        return (typeof _taskOptions[v] === 'object' && _taskOptions[v].cmd !== undefined && _taskOptions[v].prompt !== undefined)
      }),
      helper = require('commander').version('0.0.1');
  
  helper.help = function(cb) {
    this.outputHelp(cb);
  };
  
  /* sort cli helper */
  _keys.forEach(function(name){
    var _options = core.parseCLIHelp(name, _taskOptions[name]);
    helper = helper.option.apply(helper,_options);
  });
  
  helper.option('-o, --options','Displays helper for options',helper.help.bind(helper)).parse(process.argv);
  
  return core;
}

core.parseCLIHelp = function(name, options)
{
    var _args = [],
        _long = (typeof options.cmd.long === 'function' ? options.cmd.long(name, _values, options) : options.cmd.long),
        _short = (typeof options.cmd.short === 'function' ? options.cmd.short(name, _values, options) : options.cmd.short),
        _message = (typeof options.cmd.message === 'function' ? options.cmd.message(name, _values, options) : options.cmd.message),
        _help = (typeof options.cmd.help === 'function' ? options.cmd.help(name, _values, options) : (options.cmd.help || _message))
    /* command acceptance */
    _args.push((_short ? _short+', ' : '')+_long + ' [value]');
    /* command help message */
    _args.push((_help || ''));
    /* command empty function for commander */
    _args.push(function(){});
  
    return _args;
}

core.runCommand = function(name, options)
{
  var _valueSet = false,
      _value,
      _prompt;
  
  if(paprika.params.params.length !== 0)
  {
    
    _value = paprika.params.params[0];
    paprika.params.params.splice(0,1);
    core.setCLIValue(name, options, _value);
    _valueSet = true;
  }
  
  if(paprika.params.rules[options.cmd.long] !== undefined)
  {
    _value = paprika.params.rules[options.cmd.long];
    paprika.params.rules[options.cmd.long] = undefined;
    paprika.params.rules[options.cmd.short] = undefined;
    core.setCLIValue(name, options, _value);
    _valueSet = true;
  }
  else if(paprika.params.rules[options.cmd.short] !== undefined)
  {
    _value = paprika.params.rules[options.cmd.short];
    paprika.params.rules[options.cmd.long] = undefined;
    paprika.params.rules[options.cmd.short] = undefined;
    core.setCLIValue(name, options, _value);
    _valueSet = true;
  }
  
  if(!_valueSet)
  {
     _prompt = {
       name: name,
       message: (typeof options.prompt.message === 'function' ? options.prompt.message(name, _values, options) : options.prompt.message),
       type: (typeof options.prompt.type === 'function' ? options.prompt.type(name, _values, options) : (options.prompt.type || 'input'))
     }
    
    if(_prompt.type === 'list' || _prompt.type === 'checkbox')
    {
      _prompt.choices = (typeof options.prompt.choices === 'function' ? options.prompt.choices(name, _values, options) : (options.prompt.choices || []));
    }
    
    if(options.prompt.default) _prompt.default = options.prompt.default;
    
    if(typeof options.prompt.filter === 'function') _prompt.filter = options.prompt.filter;
    
    if(typeof options.prompt.validate === 'function') _prompt.validate = options.prompt.validate;
    
    inquirer.prompt(_prompt).then(core.prompt(name, options));
  }
  else
  {
    core.nextCommand(name, options);
  }
  return core;
}

core.nextCommand = function(name, options)
{
  var _action = options.action,
      _isSub;
  
  if(!_action) console.error(name,' does not have an "action" to perform, please assign it one');

  if(typeof _action === 'function') _action = _action(name,_values[name], _values, paprika.task.config);
  
  if(!_action || _action === 'exit')
  {
    console.error('Exiting process due to command: ',name);
    process.exit(1);
  }
  else if(_action === 'end')
  {
    paprika.task.method(_values);
  }
  else
  {
    _currentTask = _action;
    
    if(_currentTask.indexOf('::') !== -1)
    {
      
    }
    else if(!paprika.task.config[_currentTask])
    {
      console.error('No command exists by the name of ',_currentTask);
      process.exit(1);
    }
    else
    {
      core.runCommand(_currentTask,paprika.task.config[_currentTask]);
    }
  }
  return core;
}

core.setValue = function(name, options, value)
{
  if(typeof options.filter === 'function') value = options.filter(value,_values,paprika.task.config);
  if(options.storage === 'array')
  {
    if(!_values[name]) _values[name] = [];
    _values[name].push(value);
  }
  else
  {
    _values[name] = value;
  }
  return core;
}

core.setCLIValue = function(name, options, value)
{
  var _value = value,
      _choices,
      _index,
      _error;
  
  if(options.prompt.type === 'list')
  {
    _choices = (typeof options.prompt.choices === 'function' ? options.prompt.choices(name, value, _values) : options.prompt.choices);
    _index = _choices.map(function(v){return v.toLowerCase()}).indexOf(value.toLowerCase());
    if(_index !== -1)
    {
      _value = _choices[_index];
    }
    else
    {
      _error = console.error('\033[33mValue \033[37m', value, ' \033[33mdoes not exist as a choice in the list\033[37m', _choices);
    }
  }
  
  return (!_error ? core.setValue(name, options, _value) : core);
}

core.prompt = function(name, options)
{
  return function(res)
  {
    core.input(name, options, res[name]);
  }
}

core.input = function(name, options, value)
{
  core.setValue(name, options, value);
  if(typeof options.onaction === 'function') 
  {
    options.onaction((options.storage === 'array' ? _values[name][(_values[name].length-1)] : _values[name]),_values,paprika.task.config);
  }
  return core.nextCommand(name, options);
}

module.exports = core;