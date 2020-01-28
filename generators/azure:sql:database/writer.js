var config = require('./js/config');
var fsTools = require ('../../common/fsTools');

/**
 * Application writer
 */
module.exports = function (generator, answers) {
    answers = Object.assign({
        name: answers.databaseName,
        databaseCreateMode: answers.databaseRestore === false ? "Default" : "Copy"
    }, answers);

    fsTools.copyTo(generator, `sql-database.tf`, `${answers.name}-sql-database.tf`,answers);
    config.copy(generator.fs, answers);
}