module.exports = {
  name: {
    cmd: {
      short:'-n',
      long:'--name'
    },
    prompt: {
      message: 'What do you want to name this template?'
    },
    action: 'commands'
  },
  commands: {
    type: 'object',
    subs: {
      name: {
        prompt: {
          message: 'What is the name of this template replacement?'
        },
        action: 'commands::cmd'
      },
      cmd: {
        type: 'object',
        subs: {
          
        },
        prompt: {
          type: 'confirm',
          message: 'Would You like to add cmd shortcuts to this command?'
        },
        action:function(value)
        {
          if(value) return 'commands::cmd::short';
          return 'commands::prompt';
        }
      },
      prompt: {
        type: 'object',
        subs: {
          
        }
      }
    },
    cmd: {
      short:'-c',
      long: '--cmd'
    },
    prompt: {
      type:'confirm',
      message: 'Would you like to add some template replacement prompts?'
    },
    action:function(value)
    {
      if(value) return 'commands::name';
      return 'end';
    }
  }
};