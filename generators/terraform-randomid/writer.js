var fsTools = require ('../../common/fsTools');
var providers = require('./js/providers');

/**
 * Application writer
 */
module.exports = function (generator, answers = {}) {
    fsTools.copy(generator, "random_id.tf");
    providers.copy(generator.fs, answers);
}