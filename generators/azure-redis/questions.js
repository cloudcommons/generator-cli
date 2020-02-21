var features = require('./choices/features');
var families = require('./choices/families');
var capacities = require ('./choices/capacities');
var skus = require('./choices/skus');
var checkIpRange = require('ip-range-check');
var patchSchedule = require ('./choices/patch-schedule');


module.exports = function (generator, az, terraform, configManager, resources) {
    var questions = [];

    questions.push({
        type: "input",
        name: "name",
        message: "Redis - Name",
        default: configManager.getDefault("name", `${terraform.generateKey(generator.appname)}-redis`),
        validate: terraform.validateKey
    });

    questions.push({
        type: "list",
        name: "resourceGroup",
        message: "Redis - Resource Group",
        choices: resources.resourceGroups(),
        default: configManager.getDefault("resourceGroup")
    });

    questions.push({
        type: "list",
        name: "location",
        message: "Redis - Location",
        choices: az.locations(),
        default: configManager.getDefault("location")
    });    

    questions.push({
        type: "list",
        name: "family",
        message: "Redis - Family",
        choices: families,
        default: configManager.getDefault("family")
    });

    questions.push({
        type: "list",
        name: "sku",
        message: (answers) => `Redis - ${answers.family} - SKU`,
        choices: (answers) => skus[answers.family],
        default: (answers) => configManager.getDefault("sku", answers.family === "P" ? "Premium" : "Basic")
    });    

    questions.push({
        type: "list",
        name: "capacity",
        message: (answers) => `Redis - ${answers.family} - ${answers.sku} - Capacity`,
        choices: (answers) => capacities[answers.family],
        default: configManager.getDefault("capacity")
    });

    questions.push({
        type: "checkbox",
        name: "features",
        message: "Redis - Features",
        choices: (answers) => answers.family === "C" ? features.C : features.C.concat(features.P),
        default: configManager.getDefault("features", [])
    });

    questions.push({
        type: "list",
        name: "vnetResourceGroup",
        message: "Redis - VNET - Resource Group",
        choices: az.resourceGroups(),
        default: configManager.getDefault("vnetResourceGroup"),
        when: (answers) => answers.features.includes("vnet")
    });

    questions.push({
        type: "list",
        name: "vnetName",
        message: "Redis - VNET - Name",
        choices: (answers) => az.vnets(answers.vnetResourceGroup),
        default: configManager.getDefault("vnetName"),
        when: (answers) => answers.features.includes("vnet")
    });

    questions.push({
        type: "list",
        name: "vnetSubnet",
        message: "Redis - VNET - Subnet",
        choices: (answers) => az.vnetSubnets(answers.vnetResourceGroup, answers.vnetName),
        default: configManager.getDefault("vnetSubnet"),
        when: (answers) => answers.features.includes("vnet")
    });

    questions.push({
        type: "input",
        name: "vnetStaticIp",
        message: (answers) => `Redis - VNET - Subnet - Static IP (${az.vnetSubnetInformation(generator, answers.vnetSubnet).addressPrefix})`,        
        default: configManager.getDefault("vnetStaticIp"),
        validate: (input, answers) => {
            var cidr = az.vnetSubnetInformation(answers.vnetSubnet).addressPrefix;          
            return checkIpRange(input, cidr) ? true : `The value '${input}' is not a valid IP address or is not within '${cidr}' range`;
        },
        when: (answers) => answers.features.includes("vnet")
    });

    questions.push({
        type: "checkbox",
        name: "patchScheduleDays",
        message: "Redis - Patch schedule - Week days",
        choices: patchSchedule.weekDays,
        default: configManager.getDefault("patchScheduleDays", []),
        when: (answers) => answers.features.includes("patch-schedule")
    });

    questions.push({
        type: "list",
        name: "patchScheduleTime",
        message: "Redis - Patch schedule - UTC Time to start",
        choices: patchSchedule.time,
        default: configManager.getDefault("patchScheduleTime"),
        when: (answers) => answers.features.includes("patch-schedule")
    });

    questions.push({
        type: "input",
        name: "shardCount",
        message: "Redis - Shard count",
        default: configManager.getDefault("shardCount", 1),
        when: (answers) => answers.features.includes("shard")
    });    

    return questions;
}