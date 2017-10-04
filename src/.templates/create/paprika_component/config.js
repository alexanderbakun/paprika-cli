module.exports = {
  name: {
    cmd: {
      short: '-n',
      long: '--name'
    },
    prompt: {
      message: 'What would you like to name this component?'
    },
    action: 'description'
  },
  description: {
    cmd: {
      short: '-d',
      long: '--desc'
    },
    prompt: {
      message: 'What is the purpose of this component?'
    },
    action: 'author'
  },
  author: {
    cmd: {
      short: '-a',
      long: '--auth'
    },
    prompt: {
      message: 'Who is the other of this component?'
    },
    action: 'end'
  }
}