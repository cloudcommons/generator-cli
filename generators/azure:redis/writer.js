var config = require('./js/config');
var variables = require('./js/variables');
var fsTools = require('../../common/fsTools');

/**
 * Application writer
 */
module.exports = function (generator, answers) {

    answers = Object.assign({        
        isPremium: answers.family === "P",
        minimumTls: "1.2",
        features: {            
            vnet: answers.features.includes("vnet"),
            patchSchedule: answers.features.includes("patch-schedule"),
            sslOnly: answers.features.includes("ssl-only"),
            shard: answers.features.includes("shard"),            
        }
    }, answers);

    variables.copy(generator.fs, answers);
    fsTools.copy(generator, "redis.tf", answers);
    config.copy(generator.fs, answers);
}