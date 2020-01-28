var config = require('./js/config');
var variables = require('./js/variables');
var output = require('./js/output');
var providers = require('./js/providers');
var fsTools = require('../../common/fsTools');

/**
 * Application writer
 */
module.exports = function (generator, answers) {

    answers = Object.assign({
    }, answers);
    
    fsTools.copy(generator, "azure-search.tf", answers);
    providers.copy(generator.fs, answers);
    variables.copy(generator.fs, answers);
    config.copy(generator.fs, answers);
    output.copy(generator.fs, answers);
}