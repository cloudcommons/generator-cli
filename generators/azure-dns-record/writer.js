var config = require('./js/config');
var outputs = require('./js/output');
var variables = require('./js/variables');
var providers = require('./js/providers');

/**
 * Application writer
 */
module.exports = function (terraform, fsTools, answers) {
    var isReference = 
    answers = Object.assign({
        isRecordReference: answers.record.startsWith('azurerm'),
        ttl: answers.ttl ? answers.ttl : 3600
    }, answers);

    fsTools.copyTo(`azurerm_dns_${answers.type}_record.tf`, `${answers.name}-dns-${answers.type}-record.tf`, answers);
    config.copy(terraform, answers);
    outputs.copy(terraform, answers);
    variables.copy(terraform, answers);
    providers.copy(terraform, answers);
}