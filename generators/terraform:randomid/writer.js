var fsTools = require ('../../common/fsTools');

/**
 * Application writer
 */
module.exports = function (generator, answers = {}) {
    fsTools.copy(generator, "random_id.tf");
}