var _task = '';

function task()
{
    return _task;
}

task.parse = function(argv)
{
    _task = argv[(argv.indexOf('paprika')+1)];
    return task;
}

module.exports = task;