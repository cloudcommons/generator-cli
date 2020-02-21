var config = require('./js/config');
var outputs = require('./js/output');
var variables = require('./js/variables');
var providers = require('./js/providers');

/**
 * Application writer
 */
module.exports = function (terraform, fsTools, answers) {
    answers = Object.assign({
    }, answers);

    fsTools.copyTo(`resource-group.tf`, `${answers.name}-resource-group.tf`, answers);
    config.copy(terraform, answers);
    outputs.copy(terraform, answers);
    variables.copy(terraform, answers);
    providers.copy(terraform, answers);
}