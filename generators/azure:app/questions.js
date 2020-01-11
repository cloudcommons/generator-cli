var features = require("./choices/features");
var locations = require ("../../common/questions/azure/locations")
var pullPolicies = require("./choices/pullPolicies");
var ingressCharts = require("./choices/ingressCharts");
var ingressTypes = require("./choices/ingressTypes");

module.exports = function (generator) {
    var questions = [];
    questions.push({
        type: "input",
        name: "name",
        message: "Project name",
        default: generator.appname // Default to current folder name
    });

    questions.push({
        type: "checkbox",
        name: "features",
        message: "Application features",
        choices: features,
        default: ["ingress", "tls", "readinessProbe", "livenessProbe"]
    });

    questions = addDeploymentQuestions(questions);
    questions = addIngressQuestions(questions);
    questions = addTlsQuestions(questions);
    questions = addDnsZoneQuestions(questions);
    questions = addProbeQuestions(questions, "livenessProbe", "Liveness probe");
    questions = addProbeQuestions(questions, "readinessProbe", "Readiness probe");

    return questions;
}

function addIngressQuestions(questions) {

    questions.push({
        type: "input",
        name: "ingressHostname",
        message: "Ingress - Hostname",
        default: null,
        when: (answers) => !answers.features.includes("dns")
    })

    questions.push({
        type: "list",
        name: "ingressType",
        message: "Ingress - Type",
        choices: ingressTypes,
        default: "publicLoadBalancer",
        when: (answers) => answers.features.includes("ingress")
    });

    questions.push({
        type: "input",
        name: "aksResourceGroup",
        message: "Ingress - Public Load Balancer - AKS Managed Resource Group (Required to create an static IP address that Kubernetes can use)",
        when: (answers) => answers.features.includes("ingress") && answers.ingressType === "publicLoadBalancer"
    });

    questions.push({
        type: "input",
        name: "ingressServiceSubnet",
        message: "Ingress - Private Load Balancer - Subnet name to deploy the load balancer",
        when: (answers) => answers.features.includes("ingress") && answers.ingressType === "internalLoadBalancer"
    });       

    questions.push({
        type: "input",
        name: "privateLoadBalancerIp",
        message: "Ingress - Private Load Balancer - Static IP Address in ingress subnet",
        when: (answers) => answers.features.includes("ingress") && answers.ingressType === "internalLoadBalancer"
    });    

    questions.push({
        type: "list",
        name: "ipLocation",
        message: "Ingress - Public Load Balancer - Static IP location",
        choices: locations,
        default: "westeurope",
        when: (answers) => answers.features.includes("ingress") && answers.ingressType === "Load Balancer - Public"
    });

    questions.push({
        type: "list",
        name: "ingressChartAndVersion",
        message: "Ingress - Chart",
        choices: ingressCharts,
        default: ingressCharts[0].key,
        when: (answers) => answers.features.includes("ingress")
    });

    return questions;
}

function addDeploymentQuestions(questions) {
    questions.push({
        type: "input",
        name: "imageName",
        message: "Deployment - Docker Image (With private registry if applies, without tag)"
    });

    questions.push({
        type: "input",
        name: "imageTag",
        message: "Deployment - Docker Tag",
        default: "latest"
    });

    questions.push({
        type: "input",
        name: "imageReplicaCount",
        message: "Deployment - Image replica count",
        default: 2
    });

    questions.push({
        type: "list",
        name: "imagePullPolicy",
        message: "Deployment - Image pull policy",
        choices: pullPolicies,
        default: "Always"
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
        when: (answers) => answers.features.includes("privateRegistry")
    });

    questions.push({
        type: "input",
        name: "dockerRepoUser",
        message: "Docker - Username",
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
        default: "docker-secret",
        when: (answers) => answers.features.includes("privateRegistry")
    });

    return questions;
}

function addTlsQuestions(questions) {
    questions.push({
        type: "list",
        name: "tlsType",
        message: "TLS - Type",
        choices: ["cert-manager", "provided"],
        default: "cert-manager",
        when: (answers) => answers.features.includes("tls")
    });

    questions.push({
        type: "input",
        name: "certificateIssuer",
        message: "TLS - cert-manager issuer name",
        default: "letsencrypt",
        when: (answers) => answers.features.includes("tls") && answers.tlsType === "cert-manager"
    });

    return questions;
}

function addDnsZoneQuestions(questions) {
    questions.push({
        type: "input",
        name: "dnsZoneName",
        message: "DNS Zone - Name",
        when: (answers) => answers.features.includes("dns")
    });

    questions.push({
        type: "input",
        name: "dnsZoneResourceGroup",
        message: "DNS Zone - Resource Group",
        when: (answers) => answers.features.includes("dns")
    });

    questions.push({
        type: "input",
        name: "dnsZoneRecord",
        message: "DNS Zone - Record",
        when: (answers) => answers.features.includes("dns")
    });

    questions.push({
        type: "input",
        name: "dnsZoneRecordTtl",
        message: "DNS Zone - Record TTL",
        default: 3600,
        when: (answers) => answers.features.includes("dns")
    });

    return questions;
}

function addProbeQuestions(questions, feature, displayName) {
    questions.push({
        type: "input",
        name: feature + "InitialDelay",
        message: displayName + " - Initial delay",
        default: 10,
        when: (answers) => answers.features.includes(feature)
    });

    questions.push({
        type: "input",
        name: feature + "PeriodSeconds",
        message: displayName + " - Period (Seconds)",
        default: 30,
        when: (answers) => answers.features.includes(feature)
    });

    questions.push({
        type: "input",
        name: feature + "failureThreshold",
        message: displayName + " - Failure threshold",
        default: 3,
        when: (answers) => answers.features.includes(feature)
    });

    return questions;
}