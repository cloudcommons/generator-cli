var features = require("./choices/features");
var pullPolicies = require("./choices/pullPolicies");


module.exports = function (generator, az, terraform, configManager, resources) {
    var questions = [];
    questions.push({
        type: "input",
        name: "name",
        message: "Project name",
        default: configManager.getDefault("name", terraform.generateKey(generator.appname)),
        validate: terraform.validateKey
    });

    questions.push({
        type: "checkbox",
        name: "features",
        message: "Application features",
        choices: features,
        default: configManager.getDefault("features", ["ingress", "tls", "readinessProbe", "livenessProbe"])
    });

    questions.push({
        type: "input",
        name: "imageName",
        message: "Deployment - Docker Image (With private registry if applies, without tag)",
        default: configManager.getDefault("imageName")
    });

    questions.push({
        type: "input",
        name: "imageTag",
        message: "Deployment - Docker Tag",
        default: configManager.getDefault("imageTag", "latest")
    });

    questions.push({
        type: "input",
        name: "imageReplicaCount",
        message: "Deployment - Image replica count",
        default: configManager.getDefault("imageReplicaCount", 2)
    });

    questions.push({
        type: "list",
        name: "imagePullPolicy",
        message: "Deployment - Image pull policy",
        choices: pullPolicies,
        default: configManager.getDefault("imagePullPolicy", "Always")
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
        message: "DNS Record - Record (without DNS Zone)",
        default: configManager.getDefault("recordName"),
        when: (answers) => answers.features.includes("dns")
    });

    questions.push({
        type: "input",
        name: "ingressHostname",
        message: "Ingress - Hostname",
        default: configManager.getDefault("ingressHostname", null),
        when: (answers) => !answers.features.includes("dns")
    })    

    return questions;
}