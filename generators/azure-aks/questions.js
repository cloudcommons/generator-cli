var az = require('../../common/az');
var terraform = require('../../common/terraform');
var features = require('./choices/features');
var config = require('../../common/config');

/**
 * Gets the default value from the Yeoman storage
 * @param {*} generator 
 * @param {*} key 
 * @param {*} defaultValue 
 */
function getConfig(generator, key, defaultValue) {
    return config.getDefault(generator, key, defaultValue);
}

module.exports = function (generator) {
    var questions = [];

    questions.push({
        type: "input",
        name: "name",
        message: "Kubernetes - Cluster name",
        default: getConfig(generator, "name", `${terraform.generateKey(generator.appname)}-cluster`),
        validate: terraform.validateKey
    });

    questions.push({
        type: "list",
        name: "location",
        message: "Kubernetes - Cluster location",
        choices: az.locations(generator),
        default: getConfig(generator, "location")
    });

    questions.push({
        type: "list",
        name: "kubernetesVersion",
        message: "Kubernetes - Version",
        choices: (answers) => az.aksVersions(generator, answers.location),
        default: getConfig(generator, "kubernetesVersion", "1.15.7")
    });

    questions.push({
        type: "list",
        name: "vmsize",
        message: "Kubernetes - Virtual machine size",
        choices: (answers) => az.vmSkus(generator, answers.location),
        default: getConfig(generator, "vmsize", "Standard_DS3_v2")
    });

    questions.push({
        type: "input",
        name: "vms",
        message: "Kubernetes - Nodes",
        default: getConfig(generator, "vms", 3)
    });

    questions.push({
        type: "input",
        name: "adminUser",
        message: "Kubernetes - Virtual Machine Administrator username",
        default: getConfig(generator, "adminUser", "cloudcommons")
    });

    questions.push({
        type: "input",
        name: "sshKey",
        message: "Kubernetes - SSH Key",
        default: getConfig(generator, "sshKey")
    });

    questions.push({
        type: "input",
        name: "clientId",
        message: "Kubernetes - Service Principal Id",
        default: getConfig(generator, "clientId")
    });

    questions.push({
        type: "password",
        name: "clientSecret",
        message: "Kubernetes - Service Principal Secret",
        default: getConfig(generator, "clientSecret")
    });

    questions.push({
        type: "checkbox",
        name: "features",
        message: "Kubernetes - Cluster features",
        choices: features,
        default: getConfig(generator, "features", ["network-plugin", "network-policy", "rbac"])
    });

    questions.push({
        type: "list",
        name: "certManagerVersion",
        message: "Cert-manager - Version",
        choices: ["v0.8", "v0.9", "v0.10.1"],
        when: (answers) => answers.features.includes("cert-manager"),
        default: getConfig(generator, "certManagerVersion", "v0.10.1")
    });

    questions.push({
        type: "input",
        name: "issuerEmail",
        message: "Cert-manager - Issuer e-mail",
        when: (answers) => answers.features.includes("cert-manager"),
        default: getConfig(generator, "issuerEmail")
    });

    return questions;
}