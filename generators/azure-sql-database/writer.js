var fsTools = require('../../common/fsTools');
var config = require('./js/config');
var providers = require('./js/providers');
var variables = require('./js/variables');
var outputs = require('./js/outputs');

/**
 * Application writer
 */
module.exports = function (generator, answers) {
    answers = Object.assign({
        name: answers.databaseName,
        databaseCreateMode: answers.databaseRestore === false ? "Default" : "Copy",
        databaseServerResourceGroup: generator.options.server ? `${generator.options.server}.resource_group_name` : `var.DATABASE_SERVER_RESOURCE_GROUP`,
        databaseServer: generator.options.server ? `${generator.options.server}.name` : `var.DATABASE_SERVER`,
    }, answers);

    fsTools.copyTo(generator, `sql-database.tf`, `${answers.name}-sql-database.tf`, answers);
    config.copy(generator.fs, answers);
    providers.copy(generator.fs, answers);
    variables.copy(generator.fs, answers);
    outputs.copy(generator.fs, answers);
}