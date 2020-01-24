var az = require('../../common/az');
var features = require('./choices/features.json');

module.exports = function (generator) {
    var questions = [];

    questions.push({
        type: "input",
        name: "name",
        message: "Kubernetes - Cluster name",
        default: generator.appname // Default to current folder name
    });    

    questions.push({
        type: "list",
        name: "location",
        message: "Kubernetes - Cluster location",
        choices: az.locations(generator),
        default: "westeurope"
    });

    questions.push({
        type: "list",
        name: "kubernetesVersion",
        message: "Kubernetes - Version",
        choices: (answers) => az.aksVersions(generator, answers.location)
    });

    questions.push({
        type: "list",
        name: "vmsize",
        message: "Kubernetes - Virtual machine size",
        choices: (answers) => az.vmSkus(generator, answers.location),
        default: "Standard_DS3_v2"        
    });       

    questions.push({
        type: "input",
        name: "vms",
        message: "Kubernetes - Nodes",
        default: 3
    });    

    questions.push({
        type: "input",
        name: "adminUser",
        message: "Kubernetes - Virtual Machine Administrator username",
        default: "cloudcommons"
    });

    questions.push({
        type: "password",
        name: "sshKey",
        message: "Kubernetes - SSH Key",
    });        

    questions.push({
        type: "input",
        name: "clientId",
        message: "Kubernetes - Service Principal Id",
    }); 
    
    questions.push({
        type: "password",
        name: "clientSecret",
        message: "Kubernetes - Service Principal Secret",
    });    

    questions.push({
        type: "checkbox",
        name: "features",
        message: "Kubernetes - Cluster features",
        choices: features,
        default: ["network-plugin", "network-policy", "rbac"]
    });

    questions.push({
        type: "list",
        name: "certManagerVersion",
        message: "Cert-manager - Version",
        choices: ["v0.8", "v0.9","v0.10.1"],
        when: (answers) => answers.features.includes("cert-manager"),
        default: "v0.10.1"
    });         

    questions.push({
        type: "input",
        name: "issuerEmail",
        message: "Cert-manager - Issuer e-mail",
        when: (answers) => answers.features.includes("cert-manager")
    });         

    questions.push({
        type: "list",
        name: "acrSku",
        message: "Azure Container Registry - SKU",
        choices: ["Basic", "Standard", "Premium"],
        default: "Basic",        
        when: (answers) => answers.features.includes("acr")
    });

    return questions;
}