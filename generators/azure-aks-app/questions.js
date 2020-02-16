var features = require("./choices/features");
var pullPolicies = require("./choices/pullPolicies");
var ingressCharts = require("./choices/ingressCharts");
var ingressTypes = require("./choices/ingressTypes");


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

    questions = addDeploymentQuestions(questions, configManager);
    questions = addIngressQuestions(questions, configManager, az);
    questions = addTlsQuestions(questions, configManager);
    questions = addDnsZoneQuestions(questions, configManager, az);
    questions = addProbeQuestions(questions, configManager, "livenessProbe", "Liveness probe");
    questions = addProbeQuestions(questions, configManager, "readinessProbe", "Readiness probe");

    return questions;
}

function addIngressQuestions(questions, configManager, az) {

    questions.push({
        type: "input",
        name: "ingressHostname",
        message: "Ingress - Hostname",
        default: configManager.getDefault("ingressHostname", null),
        when: (answers) => !answers.features.includes("dns")
    })

    questions.push({
        type: "list",
        name: "ingressType",
        message: "Ingress - Type",
        choices: ingressTypes,
        default: configManager.getDefault("ingressType", "publicLoadBalancer"),
        when: (answers) => answers.features.includes("ingress")
    });

    questions.push({
        type: "list",
        name: "aksResourceGroup",
        message: "Ingress - Public Load Balancer - AKS Managed Resource Group (Required to create an static IP address that Kubernetes can use)",
        choices: az.resourceGroups(),
        default: configManager.getDefault("aksResourceGroup"),
        when: (answers) => answers.features.includes("dns") || (answers.features.includes("ingress") && answers.ingressType === "publicLoadBalancer")
    });

    questions.push({
        type: "input",
        name: "ingressServiceSubnet",
        message: "Ingress - Private Load Balancer - Subnet name to deploy the load balancer",
        default: configManager.getDefault("ingressServiceSubnet"),
        when: (answers) => answers.features.includes("ingress") && answers.ingressType === "internalLoadBalancer"
    });

    questions.push({
        type: "input",
        name: "privateLoadBalancerIp",
        message: "Ingress - Private Load Balancer - Static IP Address in ingress subnet",
        default: configManager.getDefault("privateLoadBalancerIp"),
        when: (answers) => answers.features.includes("ingress") && answers.ingressType === "internalLoadBalancer"
    });

    questions.push({
        type: "list",
        name: "ipLocation",
        message: "Ingress - Public Load Balancer - Static IP location",
        choices: az.locations(),
        default: configManager.getDefault("ipLocation", "westeurope"),
        when: (answers) => answers.features.includes("ingress") && answers.ingressType === "Load Balancer - Public"
    });

    questions.push({
        type: "list",
        name: "ingressChartAndVersion",
        message: "Ingress - Chart",
        choices: ingressCharts,
        default: configManager.getDefault("ingressChartAndVersion", ingressCharts[0].key),
        when: (answers) => answers.features.includes("ingress")
    });

    return questions;
}

function addDeploymentQuestions(questions, configManager) {
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
        type: "input",
        name: "dockerRepoServer",
        message: "Docker - Server",
        default: configManager.getDefault("dockerRepoEmail"),
        when: (answers) => answers.features.includes("privateRegistry")
    });

    questions.push({
        type: "input",
        name: "dockerRepoEmail",
        message: "Docker - Email",
        default: configManager.getDefault("dockerRepoEmail"),
        when: (answers) => answers.features.includes("privateRegistry")
    });

    questions.push({
        type: "input",
        name: "dockerRepoUser",
        message: "Docker - Username",
        default: configManager.getDefault("dockerRepoUser"),
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
        default: configManager.getDefault("dockerSecretName"),
        when: (answers) => answers.features.includes("privateRegistry")
    });

    return questions;
}

function addTlsQuestions(questions, configManager) {
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

    return questions;
}

function addDnsZoneQuestions(questions, configManager, az) {
    questions.push({
        type: "list",
        name: "dnsZoneResourceGroup",
        message: "DNS Zone - Resource Group",
        choices: az.resourceGroups(),
        default: configManager.getDefault("dnsZoneResourceGroup"),
        when: (answers) => answers.features.includes("dns")
    });

    questions.push({
        type: "list",
        name: "dnsZoneName",
        message: "DNS Zone - Name",
        choices: (answers) => az.dnsZones(answers.dnsZoneResourceGroup),
        default: configManager.getDefault("dnsZoneName"),
        when: (answers) => answers.features.includes("dns")
    });

    questions.push({
        type: "input",
        name: "dnsZoneRecord",
        message: "DNS Zone - Record",
        default: configManager.getDefault("dnsZoneRecord"),
        when: (answers) => answers.features.includes("dns")
    });

    questions.push({
        type: "input",
        name: "dnsZoneRecordTtl",
        message: "DNS Zone - Record TTL",
        default: configManager.getDefault("dnsZoneRecordTtl", 3600),
        when: (answers) => answers.features.includes("dns")
    });

    return questions;
}

function addProbeQuestions(questions, configManager, feature, displayName) {
    questions.push({
        type: "input",
        name: `${feature}InitialDelay`,
        message: `${displayName} - Initial delay`,
        default: configManager.getDefault(`${feature}InitialDelay`, 10),
        when: (answers) => answers.features.includes(feature)
    });

    questions.push({
        type: "input",
        name: `${feature}PeriodSeconds`,
        message: `${displayName} - Period (Seconds)`,
        default: configManager.getDefault(`${feature}PeriodSeconds`, 30),
        when: (answers) => answers.features.includes(feature)
    });

    questions.push({
        type: "input",
        name: `${feature}FailureThreshold`,
        message: `${displayName} - Failure threshold`,
        default: configManager.getDefault(`${feature}FailureThreshold`, 3),
        when: (answers) => answers.features.includes(feature)
    });

    return questions;
}