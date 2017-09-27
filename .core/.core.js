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

var _task = parika.task.method,
    _taskOptions = paprika.task.config,
    _currentTask = '',
    _values = {};
    

function core()
{
  
}

core.runCommand = function(name, options)
{
  
  return core;
}

core.nextCommand = function(name, options)
{
  var _action = options.action;
  
  if(!_action) console.error(name,' does not have an "action" to perform, please assign it one');

  if(typeof _action === 'function') _action = _action(name, _values, _taskOptions);
  
  if(!_action || _action === 'exit')
  {
    console.error('Exiting process due to command: ',name);
    process.exit(1);
  }
  else if(_action === 'end')
  {
    _task(_values);
  }
  else
  {
    _currentTask = _action;
    if(!options[_currentTask])
    {
      console.error('No command exists by the name of ',_currentTask);
      process.exit(1);
    }
    core.runCommand(_currentTask,options[_currentTask]);
  }
  return core;
}

core.setValue = function(name, options, value)
{
  if(typeof options.filter === 'function') value = options.filter(value,_values,_taskOptions);
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
    _choices = (typeof options.prompt.choices === 'function' ? options.prompt.choices(_values) : options.prompt.choices);
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
    core.input(name, options, res);
  }
}

core.input = function(name, options, value)
{
  core.setValue(name, options, value);
  if(typeof options.onaction === 'function') 
  {
    options.onaction((options.storage === 'array' ? _values[name][(_values[name].length-1)] : _values[name]),_values,_taskOptions);
  }
  return core.nextCommand(name, options);
}

module.exports = core;