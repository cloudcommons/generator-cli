const ingressCharts = require('./choices/ingressCharts');
const ingressTypes = require('./choices/ingressTypes');

module.exports = function (generator, az, terraform, configManager) {
    var questions = [];

    questions.push({
        type: "input",
        name: "name",
        message: "Ingress - Name",
        default: configManager.getDefault("name", terraform.generateKey(generator.appname)),
        validate: terraform.validateKey,
        when: !generator.options["name"]
    });

    questions.push({
        type: "input",
        name: "inamespace",
        message: "Ingress - Namespace",
        default: configManager.getDefault("inamespace", generator.appname),
        when: !generator.options["inamespace"]
    });        

    questions.push({
        type: "input",
        name: "dns",
        message: "Ingress - Hostname",
        default: configManager.getDefault("dns", null),
        when: !generator.options["dns"]
    });

    questions.push({
        type: "list",
        name: "ingressChartAndVersion",
        message: "Ingress - Chart",
        choices: ingressCharts,
        default: configManager.getDefault("ingressChartAndVersion", ingressCharts[0].key),
    });

    questions.push({
        type: "list",
        name: "ingressType",
        message: "Ingress - Type",
        choices: ingressTypes,
        default: configManager.getDefault("ingressType", "publicLoadBalancer"),
    });

    questions.push({
        type: "list",
        name: "aksManagedResourceGroup",
        message: "Public Ingress - Public Load Balancer - AKS Resource group",
        choices: az.resourceGroups(),
        default: configManager.getDefault("aksManagedResourceGroup"),
        when: (answers) => answers.ingressType === "publicLoadBalancer"
    });

    questions.push({
        type: "list",
        name: "aksResourceGroup",
        message: "Public Ingress - AKS Cluster to attach the IP",
        choices: (answers) => az.aksClusters(answers.aksManagedResourceGroup, "name", "nodeResourceGroup"),
        when: (answers) => answers.ingressType === "publicLoadBalancer"
    });

    questions.push({
        type: "list",
        name: "ipLocation",
        message: "Public Ingress - Public Load Balancer - Static IP location",
        choices: az.locations(),
        default: configManager.getDefault("ipLocation", "westeurope"),
        when: (answers) => answers.ingressType === "publicLoadBalancer"
    });

    questions.push({
        type: "list",
        name: "vnetName",
        message: "Internal Ingress - VNET - Name",
        choices: (answers) => az.vnets(answers.vnetResourceGroup),
        default: configManager.getDefault("vnetName"),
        when: (answers) => answers.ingressType === "internalLoadBalancer"
    });

    questions.push({
        type: "list",
        name: "ingressServiceSubnet",
        message: "Internal Ingress - VNET - Subnet",
        choices: (answers) => az.vnetSubnets(answers.vnetResourceGroup, answers.vnetName),
        default: configManager.getDefault("ingressServiceSubnet"),
        when: (answers) => answers.ingressType === "internalLoadBalancer"
    });

    questions.push({
        type: "input",
        name: "privateLoadBalancerIp",
        message: (answers) => `Internal Ingress  - VNET - Subnet - Static IP (${az.vnetSubnetInformation(generator, answers.vnetSubnet).addressPrefix})`,
        default: configManager.getDefault("privateLoadBalancerIp"),
        validate: (input, answers) => {
            var cidr = az.vnetSubnetInformation(answers.vnetSubnet).addressPrefix;
            return checkIpRange(input, cidr) ? true : `The value '${input}' is not a valid IP address or is not within '${cidr}' range`;
        },
        when: (answers) => answers.ingressType === "internalLoadBalancer"
    });
    
    return questions;
}