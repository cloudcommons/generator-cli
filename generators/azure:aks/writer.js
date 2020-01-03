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
        acrEnabled: answers.features.includes("Private Docker Registry"),
        acrName: answers.acrName,
        acrSku: answers.acrSku,
        dnsZoneEnabled: answers.features.includes("DNS Zone"),
        dnsZoneName: answers.dnsZoneName,
        rbacEnabled: answers.features.includes("Role-Based Access Control (RBAC)"),
        issuerEmail: answers.issuerEmail
    };
    
    copy(generator, "aks.tf", args);
    copy(generator, "acr.tf", args);
    copy(generator, "dns-zone.tf", args);
    copy(generator, "outputs.tf", args);
    copy(generator, "providers.tf", args);
    copy(generator, "resource-group.tf", args);
    copy(generator, "terraform.tfvars", args);
    copy(generator, "variables.tf", args);
    copy(generator, '__init__.tf', { version: "v0.12.18", backend: "local" });
    if (answers.features.includes("Let's Encrypt (v0.8)")) {
        copy(generator, "lets-encrypt/v0.8/crds.yml",args);
        copy(generator, "lets-encrypt/v0.8/cluster-issuer.yml", args);
        copyTo(generator, "lets-encrypt/v0.8/jetstack-helm-repo.tf", "lets-encrypt-jetstack-helm-repo.tf", args);
        copyTo(generator, "lets-encrypt/v0.8/lets-encrypt.tf", "lets-encrypt.tf", args);
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