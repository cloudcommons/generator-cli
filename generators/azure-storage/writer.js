var config = require('./js/config');
var outputs = require('./js/output');
var variables = require('./js/variables');
var providers = require('./js/providers');
var fsTools = require('../../common/fsTools');
var terraform = require('../../common/terraform');

/**
 * Application writer
 */
module.exports = function (generator, answers) {
    answers = Object.assign({
        resourceGroupReference: terraform.resolveDependency(answers.resourceGroup, `${answers.resourceGroup}.name`, "var.RESOURCE_GROUP_NAME"),
        locationReference: terraform.resolveDependency(answers.resourceGroup, `${answers.resourceGroup}.location`, "var.LOCATION")
    }, answers);

    fsTools.copyTo(generator, `storage.tf`, `${answers.name}-storage-account.tf`, answers);
    config.copy(generator.fs, answers);
    outputs.copy(generator.fs, answers);
    variables.copy(generator.fs, answers);
    providers.copy(generator.fs, answers);
}