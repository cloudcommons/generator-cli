var config = require('./js/config');
var outputs = require('./js/output');
var variables = require('./js/variables');
var providers = require('./js/providers');

/**
 * Application writer
 */
module.exports = function (terraform, fsTools, answers) {
    answers = Object.assign({
        resourceGroupReference: terraform.resolveDependency(answers.resourceGroup, `${answers.resourceGroup}.name`, "var.IP_RESOURCE_GROUP_NAME")
    }, answers);

    fsTools.copyTo(`ip.tf`, `${answers.name}-ip.tf`, answers);
    config.copy(terraform, answers);
    outputs.copy(terraform, answers);
    variables.copy(terraform, answers);
    providers.copy(terraform, answers);
}