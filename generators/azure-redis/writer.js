var config = require('./js/config');
var variables = require('./js/variables');
var outputs = require('./js/output');
var providers = require('./js/providers');

/**
 * Application writer
 */
module.exports = function (terraform, fsTools, answers) {

    answers = Object.assign({
        isPremium: answers.family === "P",
        minimumTls: "1.2",
        resourceGroupReference: terraform.resolveDependency(answers.resourceGroup, `${answers.resourceGroup}.name`, "var.REDIS_RESOURCE_GROUP"),
        locationReference: terraform.resolveDependency(answers.resourceGroup, `${answers.resourceGroup}.location`, "var.REDIS_LOCATION"),
        features: {
            vnet: answers.features.includes("vnet"),
            patchSchedule: answers.features.includes("patch-schedule"),
            nonSsl: answers.features.includes("non-SSL"),
            shard: answers.features.includes("shard")
        }
    }, answers);

    fsTools.copyTo("redis.tf", `${answers.name}-redis.tf`, answers);
    variables.copy(terraform, answers);    
    config.copy(terraform, answers);
    outputs.copy(terraform, answers);
    providers.copy(terraform, answers);
}