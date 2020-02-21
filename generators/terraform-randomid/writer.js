var providers = require('./js/providers');

/**
 * Application writer
 */
module.exports = function (terraform, fsTools, answers = {}) {
    fsTools.copy("random_id.tf");
    providers.copy(terraform, answers);
}