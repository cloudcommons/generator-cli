var config = require('./js/config');

/**
 * Application writer
 */
module.exports = function (generator, answers) {

    answers = Object.assign({
        name: answers.serverName,
        serverVersion: "12.0",
        serverLocations: answers.features.includes("fail-over") ? answers.failOverLocations : [answers.serverLocation],
        databaseCreateMode: answers.databaseRestore === false ? "Default" : "Copy",
    }, answers);

    copy(generator, 'sql-server.tf', answers);
    config.copyServerConfig(generator.fs, answers);
    copy(generator, 'sql-database.tf', answers);
    config.copyDatabaseConfig(generator.fs, answers);    
    if (answers.features.includes("fail-over")) {
        copy(generator, 'sql-server-failover.tf', answers);
    }
}

/**
 * Copies a file from the source path to the exact same location in destination
 * @param {*} generator Yeoman generator
 * @param {*} source Source path
 * @param {*} parameters Object with parameters to replace
 */
function copy(generator, source, parameters) {
    generator.fs.copyTpl(
        generator.templatePath(source),
        generator.destinationPath(source),
        parameters
    );
}

/**
 * Copies a file from the source to a given destination path
 * @param {*} generator Yeoman generator
 * @param {*} source Source path
 * @param {*} destination Target path
 * @param {*} parameters Object with parameters to replace
 */
function copyTo(generator, source, destination, parameters) {
    generator.fs.copyTpl(
        generator.templatePath(source),
        generator.destinationPath(destination),
        parameters
    );
}