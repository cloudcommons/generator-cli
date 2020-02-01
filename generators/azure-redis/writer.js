var config = require('./js/config');
var variables = require('./js/variables');
var fsTools = require('../../common/fsTools');
var outputs = require('./js/output');
var providers = require('./js/providers');
var terraform = require('../../common/terraform');

/**
 * Application writer
 */
module.exports = function (generator, answers) {

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

    variables.copy(generator.fs, answers);
    fsTools.copyTo(generator, "redis.tf", `${answers.name}-redis.tf`, answers);
    config.copy(generator.fs, answers);
    outputs.copy(generator.fs, answers);
    providers.copy(generator.fs, answers);
}