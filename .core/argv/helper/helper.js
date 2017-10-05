var _cmd = require('commander'),
    _helpers = {
      '-h, --help': 'Displays a helper for options',
      '-o, --options': 'Displays a helper for options'
    },
    _show;

function helper()
{
  if(_show)
  {
    
  }
}

helper.show = function(v)
{
  if(v === undefined) return _show;
  _show = !!v;
  return helper;
}

helper.register = function(short,long, message)
{
  var _key = short+', '+long;
  if(_helpers[_key] === undefined)
  {
    _helpers[_key] = message;
  }
  else
  {
    console.error('A helper with the keys',_key,' already exist');
  }
  
  return helper;
}

helper.parse = function(argv)
{
  
}

module.exports = helper;