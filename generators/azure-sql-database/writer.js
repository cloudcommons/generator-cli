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
        databaseServerReference: terraform.isDependency(answers.databaseServer) ? `${answers.databaseServer}.name` : `var.DATABASE_SERVER`,
        databaseResourceGroupReference: terraform.isDependency(answers.databaseServerResourceGroup) ? `${answers.databaseServerResourceGroup}.name` : `var.DATABASE_SERVER_RESOURCE_GROUP`
    }, answers);

    fsTools.copyTo(`sql-database.tf`, `${answers.name}-sql-database.tf`, answers);
    config.copy(terraform, answers);
    providers.copy(terraform, answers);
    variables.copy(terraform, answers);
    outputs.copy(terraform, answers);
}