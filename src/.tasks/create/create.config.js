var fs = require('fs');

module.exports = {
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
        return fs.readdirSync(paprika.location.module_tasks.templates+'/create')
        .concat((paprika.init ? (fs.readdirSync(paprika.location.local_tasks.templates+'/create')) : ([])));
      }
    },
    action:function(name,value)
    {
      return paprika.loadConfig(paprika.location.module_tasks.templates+'/create/'+value)
      .showHelp()
      .getFirstCommand();
    }
  }
};