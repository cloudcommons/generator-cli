var config = require('./js/config');
var variables = require('./js/variables');
var output = require('./js/output');
var providers = require('./js/providers');
var fsTools = require('../../common/fsTools');
var terraform = require('../../common/terraform');

/**
 * Application writer
 */
module.exports = function (generator, answers) {

    answers = Object.assign({
        resourceGroupReference: terraform.resolveDependency(`${answers.resourceGroup}.name`, "var.SEARCH_RESOURCE_GROUP"),
        locationReference: terraform.resolveDependency(`${answers.resourceGroup}.location`, "var.SEARCH_LOCATION"),
    }, answers);
    
    fsTools.copy(generator, "azure-search.tf", answers);
    providers.copy(generator.fs, answers);
    variables.copy(generator.fs, answers);
    config.copy(generator.fs, answers);
    output.copy(generator.fs, answers);
}