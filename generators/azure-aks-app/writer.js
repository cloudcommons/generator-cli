var config = require('./js/config');
var variables = require('./js/variables');
var output = require('./js/outputs');
var providers = require('./js/providers');

/**
 * Application writer
 */
module.exports = function (terraform, fsTools, answers) {
    answers = Object.assign({
        imageReplicaCount: answers.imageReplicaCount ? answers.imageReplicaCount : 2,
        privateRegistryEnabled: answers.features.includes("privateRegistry"),
        ingressEnabled: answers.features.includes("ingress"),
        tlsEnabled: answers.features.includes("tls"),        
        dnsZoneEnabled: answers.features.includes("dns") ? true : null,
    }, answers);

    config.copy(terraform, answers);
    variables.copy(terraform, answers);
    output.copy(terraform, answers);
    providers.copy(terraform, answers);
    fsTools.copy("app.tf", answers);
}