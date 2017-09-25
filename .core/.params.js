/*****
 *   Params
 *   This files functionality is to parse all console arguments that are passed to the cli tool
 *   Created by Keleko34
 *****/

var r = require('paprika-cli');

var _args = [],
    _params = [],
    _rules = {};

function params()
{
  /* The logic here is: commands should be either short: -a or --about
      if you just give a value without a previous commandline '-' or '--' keyword then these are considered params and are parsed in order
      later params are first inserted for values and rules are then inserted afterwards prior to any inputs needed */
  
  var _currentRule;
  for(var x=1,len=_args.length;x<len;x++)
  {
      if(!_currentRule)
      {
          if(_args[x].indexOf('--') !== -1)
          {
            _currentRule = _args[x];
          }
          else if(_args[x].indexOf('-') !== -1)
          {
            _currentRule = _args[x];
          }
          else
          {
            _params.push((_args[x].indexOf(',') !== -1 ? _args[x].split(',') : _args[x]));
          }
      }
      else
      {
        _rules[_currentRule.replace(/[\-]/g,'')] = (_args[x].indexOf(',') !== -1 ? _args[x].split(',') : _args[x]);
        
        _params.push(undefined);
        _currentRule = undefined;
      }
  }
  return {task:params.task(),params:params.params(),rules:params.rules()};
}

params.task = function(v)
{
  if(v === undefined) return _args[0];
  _args[0] = v;
  return params;
}

params.args = function(v)
{
  if(v === undefined) return _args;
  _args = v;
  return params;
}

params.rules = function(v)
{
   if(v === undefined) return _rules;
  _rules = v;
  return params;
}

params.params = function(v)
{
  if(v === undefined) return _params;
  _params = v;
  return params;
}

module.exports = params;