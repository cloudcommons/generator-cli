module.exports = function() {
    process.env.mockAzure = "true";
    require('events').EventEmitter.defaultMaxListeners = 25
}