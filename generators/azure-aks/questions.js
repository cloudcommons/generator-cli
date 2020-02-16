var features = require('./choices/features');

module.exports = function (generator, az, terraform, configManager, resources) {
    var questions = [];

    questions.push({
        type: "input",
        name: "name",
        message: "Kubernetes - Cluster name",
        default: configManager.getDefault("name", `${terraform.generateKey(generator.appname)}-cluster`),
        validate: terraform.validateKey
    });

    questions.push({
        type: "list",
        name: "resourceGroup",
        message: "Server - Resource Group",
        choices: resources.resourceGroups(),
        default: configManager.getDefault("resourceGroup")
    });

    questions.push({
        type: "list",
        name: "location",
        message: "Kubernetes - Cluster location",
        choices: az.locations(),
        default: configManager.getDefault("location")
    });

    questions.push({
        type: "list",
        name: "kubernetesVersion",
        message: "Kubernetes - Version",
        choices: (answers) => az.aksVersions(answers.location),
        default: configManager.getDefault("kubernetesVersion", "1.15.7")
    });

    questions.push({
        type: "list",
        name: "vmsize",
        message: "Kubernetes - Virtual machine size",
        choices: (answers) => az.vmSkus(answers.location),
        default: configManager.getDefault("vmsize", "Standard_DS3_v2")
    });

    questions.push({
        type: "input",
        name: "vms",
        message: "Kubernetes - Nodes",
        default: configManager.getDefault("vms", 3)
    });

    questions.push({
        type: "input",
        name: "adminUser",
        message: "Kubernetes - Virtual Machine Administrator username",
        default: configManager.getDefault("adminUser", "cloudcommons")
    });

    questions.push({
        type: "input",
        name: "sshKey",
        message: "Kubernetes - SSH Key",
        default: configManager.getDefault("sshKey")
    });

    questions.push({
        type: "input",
        name: "clientId",
        message: "Kubernetes - Service Principal Id",
        default: configManager.getDefault("clientId")
    });

    questions.push({
        type: "password",
        name: "clientSecret",
        message: "Kubernetes - Service Principal Secret",
        default: configManager.getDefault("clientSecret")
    });

    questions.push({
        type: "checkbox",
        name: "features",
        message: "Kubernetes - Cluster features",
        choices: features,
        default: configManager.getDefault("features", ["network-plugin", "network-policy", "rbac"])
    });

    questions.push({
        type: "list",
        name: "certManagerVersion",
        message: "Cert-manager - Version",
        choices: ["v0.10.1"],
        when: (answers) => answers.features.includes("cert-manager"),
        default: configManager.getDefault("certManagerVersion", "v0.10.1")
    });

    questions.push({
        type: "input",
        name: "issuerEmail",
        message: "Cert-manager - Issuer e-mail",
        when: (answers) => answers.features.includes("cert-manager"),
        default: configManager.getDefault("issuerEmail")
    });

    return questions;
}