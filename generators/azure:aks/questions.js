var locations = require("../../common/questions/azure/locations.json");
var vms = require("../../common/questions/azure/vm-sizes.json");
var aksVersions = require("../../common/questions/azure/aks-versions.json");

module.exports = function (generator) {
    var questions = [];

    questions.push({
        type: "input",
        name: "name",
        message: "Cluster name",
        default: generator.appname // Default to current folder name
    });    

    questions.push({
        type: "list",
        name: "location",
        message: "Azure location",
        choices: locations,
        default: "westeurope"
    });

    questions.push({
        type: "list",
        name: "kubernetesVersion",
        message: "Kubernetes - Version",
        choices: aksVersions,
        default: aksVersions[0]
    });

    questions.push({
        type: "list",
        name: "vmsize",
        message: "Kubernetes - Virtual machine size",
        choices: vms,
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
        default: "root"
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
        message: "Application features",
        choices: ["Network plugin", "Network policy", "Let's Encrypt (v0.8)", "Auto-scaler", "Role-Based Access Control (RBAC)", "Private Docker Registry", "DNS Zone"],
        default: ["Network plugin", "Network policy", "Let's Encrypt (v0.8)", "Auto-scaler", "Role-Based Access Control (RBAC)"]
    });

    questions.push({
        type: "input",
        name: "issuerEmail",
        message: "Let's Encrypt - Issuer e-mail",
        when: (answers) => answers.features.includes("Let's Encrypt (v0.8)")
    });       

    questions.push({
        type: "input",
        name: "acrName",
        message: "Azure Container Registry - Name",
        when: (answers) => answers.features.includes("Private Docker Registry")
    });      

    questions.push({
        type: "list",
        name: "acrSku",
        message: "Azure Container Registry - SKU",
        choices: ["Basic", "Standard", "Premium"],
        default: "Basic",        
        when: (answers) => answers.features.includes("Private Docker Registry")
    });

    questions.push({
        type: "input",
        name: "dnsZoneName",
        message: "DNS Zone - Name",               
        when: (answers) => answers.features.includes("DNS Zone")
    });

    return questions;
}