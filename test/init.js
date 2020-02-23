console.log("Setting up tests...");
process.env.test = "true";
require('events').EventEmitter.defaultMaxListeners = 25