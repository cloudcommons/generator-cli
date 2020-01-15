/**
 * Application writer
 */
module.exports = function (generator, answers) {
    var args = {
        name: answers.name,
        location: answers.location,
        adminUser: answers.adminUser,
        kubernetesVersion: answers.kubernetesVersion,
        vms: answers.vms,
        vmsize: answers.vmsize,
        sshKey: answers.sshKey,
        clientId: answers.clientId,
        clientSecret: answers.clientSecret,
        certManagerVersion: answers.certManagerVersion,
        acrEnabled: answers.features.includes("acr"),
        acrSku: answers.acrSku,
        rbacEnabled: answers.features.includes("rbac"),
        issuerEmail: answers.issuerEmail
    };
    
    copy(generator, "LICENSE");
    copy(generator, ".gitignore");
    copy(generator, "aks.tf", args);
    copy(generator, "acr.tf", args);
    copy(generator, "outputs.tf", args);
    copy(generator, "providers.tf", args);
    copy(generator, "resource-group.tf", args);
    copy(generator, "terraform.tfvars", args);
    copy(generator, "variables.tf", args);
    copy(generator, '__init__.tf', { version: "v0.12.19", backend: "local" });
    if (answers.features.includes("cert-manager")) {
        copy(generator, `cert-manager/${args.certManagerVersion}/crds.yml`, args);
        copy(generator, `cert-manager/${args.certManagerVersion}/cluster-issuer.yml`, args);
        copyTo(generator, `cert-manager/${args.certManagerVersion}/jetstack-helm-repo.tf`, "cert-manager-jetstack-helm-repo.tf", args);
        copyTo(generator, `cert-manager/${args.certManagerVersion}/cert-manager.tf`, "cert-manager.tf", args);
    }
    if (true) // Future condition to copy Tiller-related rubbish when people use Helm v2
    {
        copyTo(generator, "helm/v2/cluster-role.tf", "tiller-cluster-role.tf");
        copyTo(generator, "helm/v2/role-binding.tf", "tiller-role-binding.tf");
        copyTo(generator, "helm/v2/service-account.tf", "tiller-service-account.tf");
    }
}

/**
 * Copies a file from the source path to the exact same location in destination
 * @param {*} generator Yeoman generator
 * @param {*} source Source path
 * @param {*} parameters Object with parameters to replace
 */
function copy(generator, source, parameters) {
    generator.fs.copyTpl(
        generator.templatePath(source),
        generator.destinationPath(source),
        parameters
    );
}

/**
 * Copies a file from the source to a given destination path
 * @param {*} generator Yeoman generator
 * @param {*} source Source path
 * @param {*} destination Target path
 * @param {*} parameters Object with parameters to replace
 */
function copyTo(generator, source, destination, parameters) {
    generator.fs.copyTpl(
        generator.templatePath(source),
        generator.destinationPath(destination),
        parameters
    );
}