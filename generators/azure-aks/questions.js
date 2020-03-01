const features = require('./choices/features');
const networkConfiguration = require('./choices/networkConfiguration');
const regex = require('../../core/regex');

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
        name: "sizingKind",
        message: "Sizing assistant - What is the purpose of your cluster?",
        choices: networkConfiguration.kind,
        default: configManager.getDefault("sizingKind", "development")
    });

    questions.push({
        type: "list",
        name: "sizingAccesibility",
        message: "Sizing assistant - Cluster accesibility?",
        choices: networkConfiguration.accesibility,
        default: configManager.getDefault("sizingAccesibility", "public")
    });

    questions.push({
        type: "list",
        name: "vmsize",
        message: "Kubernetes - Virtual machine size",
        choices: (answers) => az.vmSkus(answers.location),
        default: (answers) => configManager.getDefault("vmsize", () => {
            switch (answers.sizingKind) {
                case "development":
                    return "Standard_DS1_v2";
                case "production-small":
                    return "Standard_DS2_v2";
                case "production-large":
                    return "Standard_DS3_v2";
                default:
                    return "Standard_DS2_v2";
            }
        })
    });

    questions.push({
        type: "input",
        name: "vms",
        message: "Kubernetes - Number of initial nodes (This can be changed in the future)",
        default: (answers) => configManager.getDefault("vms", () => {
            switch (answers.sizingKind) {
                case "development":
                    return 1;
                case "production-small":
                    return 3;
                case "production-medium":
                    return 10;
                case "production-large":
                    return 50;
                default:
                    return 4;
            }
        }),
        validate: regex.isInteger
    });

    questions.push({
        type: "input",
        name: "vmsMax",
        message: "Kubernetes - Maximum nodes (The VNET will be created to accomodate this number. This decision is final and cannot be changed without destroying the cluster)",
        default: (answers) => configManager.getDefault("vmsMax", () => {
            switch (answers.sizingKind) {
                case "development":
                    return 4;
                case "production-small":
                    return 12;
                case "production-medium":
                    return 40;
                case "production-large":
                    return 200;
                default:
                    return 4;
            }
        }),
        validate: regex.isInteger
    });

    questions.push({
        type: "input",
        name: "podsPerNode",
        message: "Kubernetes - Pods per node (This decision is final and cannot be changed without destroy the cluster)",
        default: (answers) => configManager.getDefault("podsPerNode", () => {
            switch (answers.sizingKind) {
                case "development":
                    return 110;
                case "production-small":
                case "production-medium":
                case "production-large":
                    return 60;
                default:
                    return 30;
            }
        }),
        validate: regex.isInteger
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
        type: "input",
        name: "networkPluginCidr",
        message: "Network (CNI) - VNET Cidr",
        when: (answers) => answers.features.includes("network-plugin"),
        default: configManager.getDefault("networkPluginCidr", "172.0.0.0"),
        validate: regex.isIpAddress
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

    questions.push({
        type: "input",
        name: "minNodeCount",
        message: "Auto-scaler - Minimum node count",
        when: (answers) => answers.features.includes("auto-scaler"),
        validate: validateMinCount,
        default: configManager.getDefault("issuerEmail")
    });

    questions.push({
        type: "input",
        name: "maxNodeCount",
        message: "Auto-scaler - Maximum node count",
        when: (answers) => answers.features.includes("auto-scaler"),
        validate: validateMaxCount,
        default: configManager.getDefault("issuerEmail")
    });

    return questions;
}

function validateMinCount(value) {
    var isInteger = regex.isInteger(value);
    if (isInteger !== true) return isInteger;
    if (value < 1) return "The minimum number of nodes should be greater than 0"
    return true;
}

function validateMaxCount(value, answers) {
    var isInteger = regex.isInteger(value);
    if (isInteger !== true) return isInteger;
    if (answers.minNodeCount < value) return `The maximum number of nodes should greater than the minimum (${minValue})`;
    return true;
}

