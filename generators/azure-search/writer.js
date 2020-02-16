var config = require('./js/config');
var variables = require('./js/variables');
var output = require('./js/output');
var providers = require('./js/providers');

/**
 * Application writer
 */
module.exports = function (terraform, fsTools, answers) {    
    answers = Object.assign({
        resourceGroupReference: terraform.resolveDependency(answers.resourceGroup, `${answers.resourceGroup}.name`, "var.SEARCH_RESOURCE_GROUP"),
        locationReference: terraform.resolveDependency(answers.resourceGroup, `${answers.resourceGroup}.location`, "var.SEARCH_LOCATION"),
    }, answers);
    
    fsTools.copyTo("azure-search.tf", `${answers.name}-search.tf`, answers);
    providers.copy(terraform, answers);
    variables.copy(terraform, answers);
    config.copy(terraform, answers);
    output.copy(terraform, answers);
}