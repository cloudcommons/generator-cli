var config = require('./js/config');
var variables = require('./js/variables');
var output = require('./js/outputs');
var providers = require('./js/providers');

/**
 * Application writer
 */
module.exports = function (terraform, fsTools, answers) {

    var chartParts = answers.ingressChartAndVersion ? answers.ingressChartAndVersion.split(":") : null;

    answers = Object.assign({
        imageReplicaCount: answers.imageReplicaCount ? answers.imageReplicaCount : 2,
        privateRegistryEnabled: answers.features.includes("privateRegistry"),
        ingressEnabled: answers.features.includes("ingress"),
        internalLoadBalancer: answers.features.includes("ingress") && answers.ingressType === "internalLoadBalancer",
        location: answers.ipLocation ? answers.ipLocation : "westeurope",
        ingressChart: chartParts ? chartParts[0] : null,
        ingressChartVersion: chartParts ? chartParts[1] : null,
        ingressReplicas: answers.ingressReplicas ? answers.ingressReplicas : 2,
        tlsEnabled: answers.features.includes("tls"),
        ingressHostname: answers.ingressHostname ? answers.ingressHostname : null,
        dnsZoneEnabled: answers.features.includes("dns") ? true : null,
    }, answers);

    config.copy(terraform, answers);
    variables.copy(terraform, answers);
    output.copy(terraform, answers);
    providers.copy(terraform, answers);
    fsTools.copy("app.tf", answers);
    if (answers.privateRegistryEnabled) {
        fsTools.copy("docker-secret.tf", answers);
    }

    fsTools.copy('nginx-ingress.tf', answers);
    fsTools.copy('templates/ingress.yml', answers);
    if (!answers.internalLoadBalancer) {
        fsTools.copy('ip.tf', answers);
    }
    if (answers.dnsZoneEnabled) {
        fsTools.copy('dns.tf', answers);
    }
}