var config = require('./js/config');
var fsTools = require ('../../common/fsTools');

/**
 * Application writer
 */
module.exports = function (generator, answers) {

    answers = Object.assign({
        name: answers.serverName,
        serverVersion: "12.0",
        serverLocations: answers.features.includes("fail-over") ? answers.serverLocations : [answers.serverLocation]
    }, answers);

    fsTools.copyTo(generator, 'sql-server.tf', `${answers.name}-sql-server.tf`, answers);
    config.copy(generator.fs, answers); 
    if (answers.features.includes("fail-over")) {
        fsTools.copyTo(generator, 'sql-server-failover.tf', `${answers.name}-sql-server-failover.tf`, answers);
    }
}