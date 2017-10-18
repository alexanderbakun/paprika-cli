#!/usr/bin/env node

'use strict';

var globals = require('./../.core/.globals');

process.on('unhandledRejection', function (err) {
  console.error('unhandledRejection',err.message,err.stack);
});

globals
.set()
.getTask()
.setMethods()
.call();