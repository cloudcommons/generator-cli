var config = require('./js/config');
var variables = require('./js/variables');
var providers = require('./js/providers');
var outputs = require('./js/outputs');

/**
 * Application writer
 */
module.exports = function (terraform, fsTools, answers) {

    answers = Object.assign({
        serverVersion: "12.0",
        failOver: answers.features.includes("fail-over"),
        serverLocations: answers.features.includes("fail-over") ? answers.serverLocations : [answers.serverLocation],
        resourceGroupReference: terraform.resolveDependency(answers.resourceGroup, `${answers.resourceGroup}.name`, "var.RESOURCE_GROUP_NAME")
    }, answers);

    fsTools.copyTo('sql-server.tf', `${answers.name}-sql-server.tf`, answers);
    config.copy(terraform, answers); 
    variables.copy(terraform, answers);
    providers.copy(terraform, answers);
    outputs.copy(terraform, answers);
    if (answers.features.includes("fail-over")) {
        fsTools.copyTo('sql-server-failover.tf', `${answers.databaseName}-failover.tf`, answers);
    }
}