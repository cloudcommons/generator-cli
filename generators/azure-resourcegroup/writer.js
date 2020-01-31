var config = require('./js/config');
var outputs = require('./js/output');
var variables = require('./js/variables');
var providers = require('./js/providers');
var fsTools = require ('../../common/fsTools');

/**
 * Application writer
 */
module.exports = function (generator, answers) {
    answers = Object.assign({
        name: answers.databaseName,
        databaseCreateMode: answers.databaseRestore === false ? "Default" : "Copy"
    }, answers);

    fsTools.copyTo(generator, `resource-group.tf`, `${answers.name}-resource-group.tf`,answers);    
    config.copy(generator.fs, answers);
    outputs.copy(generator.fs, answers);
    variables.copy(generator.fs, answers);
    providers.copy(generator.fs, answers);
}