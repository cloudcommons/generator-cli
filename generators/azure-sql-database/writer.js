var config = require('./js/config');
var providers = require('./js/providers');
var variables = require('./js/variables');
var outputs = require('./js/outputs');

/**
 * Application writer
 */
module.exports = function (options, terraform, fsTools, answers) {
    answers = Object.assign({
        name: options.databaseName ? options.databaseName: answers.databaseName,
        databaseCreateMode: answers.databaseRestore === false ? "Default" : "Copy",
        databaseServerResourceGroup: options.server ? `${options.server}.resource_group_name` : `var.DATABASE_SERVER_RESOURCE_GROUP`,
        databaseServer: options.server ? `${options.server}.name` : `var.DATABASE_SERVER`,
    }, answers);

    fsTools.copyTo(`sql-database.tf`, `${answers.name}-sql-database.tf`, answers);
    config.copy(terraform, answers);
    providers.copy(terraform, answers);
    variables.copy(terraform, answers);
    outputs.copy(terraform, answers);
}