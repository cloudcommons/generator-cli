var variables = require('./js/variables');
var fsTools = require('../../common/fsTools');
/**
 * Application writer
 */
module.exports = function (generator, answers) {
    fsTools.copy(generator, "LICENSE");
    fsTools.copyTo(generator, 'gitignore', '.gitignore');
    fsTools.copyTo(generator, `init/${answers.backendType}.tf`, '__init__.tf', answers);
    variables.copy(generator.fs, answers);
}