const features = require('./choices/features');
const ingressTypes = require('./choices/ingressTypes');
const ingressCharts = require('./choices/ingressCharts');
const regex = require('../../core/regex');

module.exports = function (generator, az, terraform, configManager) {
    var questions = [];

    questions.push({
        type: "input",
        name: "name",
        message: "Helm - Release name",
        default: configManager.getDefault("name", terraform.generateKey(generator.appname)),
        validate: terraform.validateKey
    });

    questions.push({
        type: "input",
        name: "repositoryName",
        message: "Helm - Repository name",
        default: configManager.getDefault("repositoryName", "stable")
    });

    questions.push({
        type: "input",
        name: "repositoryUrl",
        message: "Helm - Repository URL",
        default: configManager.getDefault("repositoryUrl", "https://kubernetes-charts.storage.googleapis.com")
    });    

    questions.push({
        type: "input",
        name: "chartName",
        message: "Helm - Chart name (Without repository)",
        default: configManager.getDefault("chartName")
    });

    questions.push({
        type: "input",
        name: "chartVersion",
        message: "Helm - Chart version",
        default: configManager.getDefault("chartVersion", "latest")
    });

    questions.push({
        type: "confirm",
        name: "recreatePods",
        message: "Helm - Recreate pods",
        default: configManager.getDefault("recreatePods", true)
    });

    questions.push({
        type: "checkbox",
        name: "features",
        message: "Application features",
        choices: features,
        default: configManager.getDefault("features", [])
    });

    questions.push({
        type: "list",
        name: "tlsType",
        message: "TLS - Type",
        choices: ["cert-manager", "provided"],
        default: configManager.getDefault("tlsType", "cert-manager"),
        when: (answers) => answers.features.includes("tls")
    });

    questions.push({
        type: "input",
        name: "certificateIssuer",
        message: "TLS - cert-manager issuer name",
        default: configManager.getDefault("certificateIssuer", "letsencrypt"),
        when: (answers) => answers.features.includes("tls") && answers.tlsType === "cert-manager"
    });

    questions.push({
        type: "input",
        name: "recordName",
        message: "DNS Record - Record",
        default: configManager.getDefault("recordName"),
        when: (answers) => answers.features.includes("dns")
    });    


    return questions;

}