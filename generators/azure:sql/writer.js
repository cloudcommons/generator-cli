/**
 * Application writer
 */
module.exports = function (generator, answers) {
    var args = {
        name: answers.serverName,
        resourceGroup: answers.resourceGroup,
        serverVersion: "12.0",
        serverLocations: answers.features.includes("fail-over") ? answers.failOverLocations : [answers.serverLocation],
        serverAdminLogin: answers.serverAdminLogin,
        serverAdminPassword: answers.serverAdminPassword,
        databaseName: answers.databaseName,
        databaseEdition: answers.databaseEdition,
        databaseSize: answers.databaseSize,
        databaseCreateMode: answers.databaseRestore === false ? "Default" : "Copy",
        databaseSourceId: answers.restoreDatabaseId,
        features: answers.features
    }

    copy(generator, 'sql-database.tf', args);
    copy(generator, 'sql-database.auto.tfvars', args);
    copy(generator, 'sql-server.tf', args);
    copy(generator, 'sql-server.auto.tfvars', args);    
    if (answers.features.includes("fail-over")) {
        copy(generator, 'sql-server-failover.tf', args);
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