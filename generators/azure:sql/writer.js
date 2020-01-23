var terraform = require('../../common/terraform');

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
    writeDatabaseConfig(generator, args);
    copy(generator, 'sql-server.tf', args);
    writeServerConfig(generator, args);
    if (answers.features.includes("fail-over")) {
        copy(generator, 'sql-server-failover.tf', args);
    }
}
/**
 * Appends the terraform configuration for the database
 * @param {*} generator 
 * @param {*} args 
 */
function writeDatabaseConfig(generator, args) {
    terraform.writeConfig(generator, {
        DATABASE_NAME: args.databaseName,
        DATABASE_EDITION: args.databaseEdition,
        DATABASE_REQUESTED_SERVICE_OBJETIVE_NAME: args.databaseSize,
        DATABASE_CREATE_MODE: args.databaseCreateMode,
        DATABASE_SOURCE_ID: args.databaseSourceId
    });
}

/**
 * Appends the terraform configuration for the database
 * @param {*} generator 
 * @param {*} args 
 */
function writeServerConfig(generator, args) {
    terraform.writeConfig(generator, {
        RESOURCE_GROUP_NAME: args.resourceGroup,
        SQL_LOCATIONS: args.serverLocations,
        SQL_NAME_PREFIX: args.name,
        SQL_VERSION: args.serverVersion,
        SQL_ADMIN_LOGIN: args.serverAdminLogin,
        SQL_ADMIN_PASSWORD: args.serverAdminPassword
    });
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