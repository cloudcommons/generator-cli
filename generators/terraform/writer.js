var variables = require('./js/variables');
/**
 * Application writer
 */
module.exports = function (terraform, fsTools, answers) {
    fsTools.copy("LICENSE");
    fsTools.copyTo('gitignore', '.gitignore');
    fsTools.copyTo(`init/${answers.backendType}.tf`, '__init__.tf', answers);
    variables.copy(terraform, answers);
}