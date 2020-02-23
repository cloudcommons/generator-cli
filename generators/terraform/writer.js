var variables = require('./js/variables');
/**
 * Application writer
 */
module.exports = function (terraform, fsTools, answers) {
    fsTools.copy("LICENSE");
    fsTools.copyTo('gitignore', '.gitignore');
    var backEnd = require(`./js/backends/${answers.backendType}`);
    backEnd.copy(terraform, answers);
    variables.copy(terraform, answers);
}