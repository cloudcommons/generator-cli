var fsTools = require ('../../common/fsTools');
var config = require('./js/config');
var variables = require('./js/variables');
var outputs = require('./js/outputs');
var providers = require('./js/providers');
var resources = require('../../common/resources');

/**
 * Application writer
 */
module.exports = function (generator, answers) {

    answers = Object.assign({
        acrEnabled: answers.features.includes("acr"),
        rbacEnabled: answers.features.includes("rbac")
    }, answers);
    
    config.copy(generator.fs, answers);
    variables.copy(generator.fs, answers);
    outputs.copy(generator.fs, answers);
    providers.copy(generator.fs, answers);    
    fsTools.copy(generator, "aks.tf", answers); 
    resources.push("azurerm_kubernetes_cluster", `azurerm_kubernetes_cluster.${answers.name}-kubernetes`);
    fsTools.copy(generator, "resource-group.tf", answers);
    if (answers.features.includes("cert-manager")) {
        fsTools.copy(generator, `cert-manager/${answers.certManagerVersion}/crds.yml`, answers);
        fsTools.copy(generator, `cert-manager/${answers.certManagerVersion}/cluster-issuer.yml`, answers);
        fsTools.copyTo(generator, `cert-manager/${answers.certManagerVersion}/jetstack-helm-repo.tf`, "cert-manager-jetstack-helm-repo.tf", answers);
        fsTools.copyTo(generator, `cert-manager/${answers.certManagerVersion}/cert-manager.tf`, "cert-manager.tf", answers);
    }
    if (answers.features.includes("atarraya")) {
        fsTools.copyTo(generator, "atarraya/atarraya.tf", "atarraya.tf", answers);
    }
    if (true) // Future condition to copy Tiller-related rubbish when people use Helm v2
    {
        fsTools.copyTo(generator, "helm/v2/cluster-role.tf", "tiller-cluster-role.tf");
        fsTools.copyTo(generator, "helm/v2/role-binding.tf", "tiller-role-binding.tf");
        fsTools.copyTo(generator, "helm/v2/service-account.tf", "tiller-service-account.tf");
    }
}