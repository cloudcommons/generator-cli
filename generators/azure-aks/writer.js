var config = require('./js/config');
var variables = require('./js/variables');
var outputs = require('./js/outputs');
var providers = require('./js/providers');
/**
 * Application writer
 */
module.exports = function (terraform, fsTools, answers, options) {

    answers = Object.assign({        
        acrEnabled: answers.features.includes("acr"),
        rbacEnabled: answers.features.includes("rbac"),
        autoScalingEnabled: answers.features.includes("auto-scaler"),
        aadPodId: answers.features.includes("aad-pod-id"),
        minNodeCount: this.autoScalingEnabled === true ? answers.minNodeCount : 0,
        maxNodeCount: this.autoScalingEnabled === true ? answers.maxNodeCount : 0,
        resourceGroupReference: terraform.resolveDependency(answers.resourceGroup, `${answers.resourceGroup}.name`, "var.AKS_RESOURCE_GROUP_NAME"),
        useHelm2: options["helm2"] !== undefined
    }, answers);

    config.copy(terraform, answers);
    variables.copy(terraform, answers);
    outputs.copy(terraform, answers);
    providers.copy(terraform, answers);
    fsTools.copy("aks.tf", answers);    
    if (answers.features.includes("cert-manager")) {
        fsTools.copy(`cert-manager/${answers.certManagerVersion}/crds.yml`, answers);
        fsTools.copy(`cert-manager/${answers.certManagerVersion}/cluster-issuer.yml`, answers);
        fsTools.copyTo(`cert-manager/${answers.certManagerVersion}/jetstack-helm-repo.tf`, "cert-manager-jetstack-helm-repo.tf", answers);
        fsTools.copyTo(`cert-manager/${answers.certManagerVersion}/cert-manager.tf`, "cert-manager.tf", answers);
    }

    if (answers.features.includes("atarraya")) {
        fsTools.copyTo("atarraya/atarraya.tf", "atarraya.tf", answers);
    }

    if (!answers.useHelm2)
    {
        var helmPrivder = require('./templates/helm/v3/providers.js');
        helmPrivder.copy(terraform, answers);
    } else {         
        fsTools.copyTo("helm/v2/cluster-role.tf", "tiller-cluster-role.tf");
        fsTools.copyTo("helm/v2/role-binding.tf", "tiller-role-binding.tf");
        fsTools.copyTo("helm/v2/service-account.tf", "tiller-service-account.tf");
        var helmPrivder = require('./templates/helm/v2/providers.js');
        helmPrivder.copy(terraform, answers);
    }

    if (answers.aadPodId) {
        if (answers.rbacEnabled) {
            fsTools.copyTo("aad-pod-id/aad-pod-id-rbac.tf", "aad-pod-id-rbac.tf", answers);
        }
        else {
            console.log("aad-pod-id not support without RBAC yet");
            // TODO This module is not published yet
            //fsTools.copyTo("aad-pod-id/aad-pod-id.tf", "aad-pod-id.tf", answers);
        }
    }
}