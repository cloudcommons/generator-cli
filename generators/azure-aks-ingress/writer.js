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
        internalLoadBalancer: answers.ingressType === "internalLoadBalancer",
        loadBalancerIpReference: this.internalLoadBalancer ? `var.INGRESS_IP` : `local.ingress_enabled ? azurerm_public_ip.${answers.name}-ingress.ip_address : null`,
        ingressChart: chartParts ? chartParts[0] : null,
        ingressChartVersion: chartParts ? chartParts[1] : null,
        ingressReplicas: answers.ingressReplicas ? answers.ingressReplicas : 2
    }, answers);

    fsTools.copyTo(`nginx/ingress.tf`, `${answers.name}-nginx-ingress.tf`, answers);
    fsTools.copyTo(`nginx/templates/${answers.ingressType === "publicLoadBalancer" ? 'public-ingress' : 'internal-ingress'}.yml`, `templates/${answers.name}-ingress.yml`, answers);

    config.copy(terraform, answers);
    outputs.copy(terraform, answers);
    variables.copy(terraform, answers);
    providers.copy(terraform, answers);
}