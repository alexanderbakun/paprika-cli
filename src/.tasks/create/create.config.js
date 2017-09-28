module.exports = {
  init:true,
  firstCommand:'template',
  template: {
    cmd: {
      long: '--template',
      short: '-t',
      help: 'the name of the template to use'
    },
    prompt: {
      message: 'Please choose a template to use',
      type: 'list',
      choices: function(){
        return ['none'];
      }
    },
    action:'name'
  },
  name: {
    cmd: {
      long: '--name',
      short: '-n',
      help: 'the name of the template to use'
    },
    prompt: {
      message: 'Please name this template'
    },
    action:'end'
  }
};