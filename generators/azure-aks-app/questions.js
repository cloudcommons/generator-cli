var features = require("./choices/features");
var pullPolicies = require("./choices/pullPolicies");
var ingressCharts = require("./choices/ingressCharts");
var ingressTypes = require("./choices/ingressTypes");
var az = require('../../common/az');
var config = require('../../common/config');
var terraform = require('../../common/terraform');

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
        message: "Project name",
        default: getConfig(generator, "name", terraform.generateKey(generator.appname)),
        validate: terraform.validateKey
    });

    questions.push({
        type: "checkbox",
        name: "features",
        message: "Application features",
        choices: features,
        default: getConfig(generator, "features", ["ingress", "tls", "readinessProbe", "livenessProbe"])
    });

    questions = addDeploymentQuestions(generator, questions);
    questions = addIngressQuestions(generator, questions);
    questions = addTlsQuestions(generator, questions);
    questions = addDnsZoneQuestions(generator, questions);
    questions = addProbeQuestions(generator, questions, "livenessProbe", "Liveness probe");
    questions = addProbeQuestions(generator, questions, "readinessProbe", "Readiness probe");

    return questions;
}

function addIngressQuestions(generator, questions) {

    questions.push({
        type: "input",
        name: "ingressHostname",
        message: "Ingress - Hostname",
        default: getConfig(generator, "ingressHostname", null),
        when: (answers) => !answers.features.includes("dns")
    })

    questions.push({
        type: "list",
        name: "ingressType",
        message: "Ingress - Type",
        choices: ingressTypes,
        default: getConfig(generator, "ingressType", "publicLoadBalancer"),
        when: (answers) => answers.features.includes("ingress")
    });

    questions.push({
        type: "list",
        name: "aksResourceGroup",
        message: "Ingress - Public Load Balancer - AKS Managed Resource Group (Required to create an static IP address that Kubernetes can use)",
        choices: az.resourceGroups(generator),
        default: getConfig(generator, "aksResourceGroup"),
        when: (answers) => answers.features.includes("ingress") && answers.ingressType === "publicLoadBalancer"
    });

    questions.push({
        type: "input",
        name: "ingressServiceSubnet",
        message: "Ingress - Private Load Balancer - Subnet name to deploy the load balancer",
        default: getConfig(generator, "ingressServiceSubnet"),
        when: (answers) => answers.features.includes("ingress") && answers.ingressType === "internalLoadBalancer"
    });       

    questions.push({
        type: "input",
        name: "privateLoadBalancerIp",
        message: "Ingress - Private Load Balancer - Static IP Address in ingress subnet",
        default: getConfig(generator, "privateLoadBalancerIp"),
        when: (answers) => answers.features.includes("ingress") && answers.ingressType === "internalLoadBalancer"
    });    

    questions.push({
        type: "list",
        name: "ipLocation",
        message: "Ingress - Public Load Balancer - Static IP location",
        choices: az.locations(generator),
        default: getConfig(generator, "ipLocation", "westeurope"),
        when: (answers) => answers.features.includes("ingress") && answers.ingressType === "Load Balancer - Public"
    });

    questions.push({
        type: "list",
        name: "ingressChartAndVersion",
        message: "Ingress - Chart",
        choices: ingressCharts,
        default: getConfig(generator, "ingressChartAndVersion", ingressCharts[0].key),
        when: (answers) => answers.features.includes("ingress")
    });

    return questions;
}

function addDeploymentQuestions(generator, questions) {
    questions.push({
        type: "input",
        name: "imageName",
        message: "Deployment - Docker Image (With private registry if applies, without tag)",
        default: getConfig(generator, "imageName")
    });

    questions.push({
        type: "input",
        name: "imageTag",
        message: "Deployment - Docker Tag",
        default: getConfig(generator, "imageTag", "latest")
    });

    questions.push({
        type: "input",
        name: "imageReplicaCount",
        message: "Deployment - Image replica count",
        default: getConfig(generator, "imageReplicaCount", 2)
    });

    questions.push({
        type: "list",
        name: "imagePullPolicy",
        message: "Deployment - Image pull policy",
        choices: pullPolicies,
        default: getConfig(generator, "imagePullPolicy", "Always")
    });

    questions.push({
        type: "input",
        name: "dockerRepoServer",
        message: "Docker - Server",
        when: (answers) => answers.features.includes("privateRegistry")
    });

    questions.push({
        type: "input",
        name: "dockerRepoEmail",
        message: "Docker - Email",
        default: getConfig(generator, "dockerRepoEmail"),
        when: (answers) => answers.features.includes("privateRegistry")
    });

    questions.push({
        type: "input",
        name: "dockerRepoUser",
        message: "Docker - Username",
        default: getConfig(generator, "dockerRepoUser"),
        when: (answers) => answers.features.includes("privateRegistry")
    });

    questions.push({
        type: "password",
        name: "dockerRepoPassword",
        message: "Docker - Password",
        when: (answers) => answers.features.includes("privateRegistry")
    });

    questions.push({
        type: "input",
        name: "dockerSecretName",
        message: "Docker - Secret name",
        default: getConfig(generator, "dockerSecretName"),
        when: (answers) => answers.features.includes("privateRegistry")
    });

    return questions;
}

function addTlsQuestions(generator, questions) {
    questions.push({
        type: "list",
        name: "tlsType",
        message: "TLS - Type",
        choices: ["cert-manager", "provided"],
        default: getConfig(generator, "tlsType", "cert-manager"),
        when: (answers) => answers.features.includes("tls")
    });

    questions.push({
        type: "input",
        name: "certificateIssuer",
        message: "TLS - cert-manager issuer name",
        default: getConfig(generator, "certificateIssuer", "letsencrypt"),
        when: (answers) => answers.features.includes("tls") && answers.tlsType === "cert-manager"
    });

    return questions;
}

function addDnsZoneQuestions(generator, questions) {
    questions.push({
        type: "list",
        name: "dnsZoneResourceGroup",
        message: "DNS Zone - Resource Group",
        choices: az.resourceGroups(generator),
        default: getConfig(generator, "dnsZoneResourceGroup"),
        when: (answers) => answers.features.includes("dns")
    });

    questions.push({
        type: "list",
        name: "dnsZoneName",
        message: "DNS Zone - Name",
        choices: (answers) => az.dnsZones(generator, answers.dnsZoneResourceGroup),
        default: getConfig(generator, "dnsZoneName"),
        when: (answers) => answers.features.includes("dns")
    });

    questions.push({
        type: "input",
        name: "dnsZoneRecord",
        message: "DNS Zone - Record",
        default: getConfig(generator, "dnsZoneRecord"),
        when: (answers) => answers.features.includes("dns")
    });

    questions.push({
        type: "input",
        name: "dnsZoneRecordTtl",
        message: "DNS Zone - Record TTL",
        default: 3600,
        default: getConfig(generator, "dnsZoneRecordTtl", 3600),
        when: (answers) => answers.features.includes("dns")
    });

    return questions;
}

function addProbeQuestions(generator, questions, feature, displayName) {
    questions.push({
        type: "input",
        name: `${feature}InitialDelay`,
        message: `${displayName} - Initial delay`,
        default: getConfig(generator, `${feature}InitialDelay`, 10),
        when: (answers) => answers.features.includes(feature)
    });

    questions.push({
        type: "input",
        name: `${feature}PeriodSeconds`,
        message: `${displayName} - Period (Seconds)`,
        default: getConfig(generator, `${feature}PeriodSeconds`, 30),
        when: (answers) => answers.features.includes(feature)
    });

    questions.push({
        type: "input",
        name: `${feature}FailureThreshold`,
        message: `${displayName} - Failure threshold`,
        default: getConfig(generator, `${feature}FailureThreshold`, 3),
        when: (answers) => answers.features.includes(feature)
    });

    return questions;
}