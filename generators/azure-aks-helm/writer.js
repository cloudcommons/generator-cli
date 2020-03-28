var config = require('./js/config');
var outputs = require('./js/output');
var variables = require('./js/variables');
var providers = require('./js/providers');

/**
 * Application writer
 */
module.exports = function (terraform, fsTools, answers) {
    var chartParts = answers.ingressChartAndVersion ? answers.ingressChartAndVersion.split(":") : null;
    
    answers = Object.assign({
        privateRegistryEnabled: answers.features.includes("privateRegistry"),
        ingressEnabled: answers.features.includes("ingress"),
        internalLoadBalancer: answers.features.includes("ingress") && answers.ingressType === "internalLoadBalancer",
        ingressChart: chartParts ? chartParts[0] : null,
        ingressChartVersion: chartParts ? chartParts[1] : null,
        ingressReplicas: answers.ingressReplicas ? answers.ingressReplicas : 2,
        tlsEnabled: answers.features.includes("tls"),
        ingressHostname: answers.ingressHostname ? answers.ingressHostname : null,
        dnsZoneEnabled: answers.features.includes("dns") ? true : null,
    }, answers);

    fsTools.copyTo(`helm-chart.tf`, `${answers.name}-helm-chart.tf`, answers);
    fsTools.copyTo(`helm-repository.tf`, `helm-repository-${answers.repositoryName}.tf`, answers);
    fsTools.copyTo(`templates/values.yml`, `templates/${answers.name}-values.yml`, answers);
    config.copy(terraform, answers);
    outputs.copy(terraform, answers);
    variables.copy(terraform, answers);
    providers.copy(terraform, answers); 
}