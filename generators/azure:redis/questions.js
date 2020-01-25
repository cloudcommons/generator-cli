var features = require('./choices/features');
var az = require('../../common/az');
var getConfig = require('../../common/getConfig')
var families = require('./choices/families');
var capacities = require ('./choices/capacities');
var skus = require('./choices/skus');
var checkIpRange = require('ip-range-check');
var patchSchedule = require ('./choices/patch-schedule');


module.exports = function (generator) {
    var questions = [];

    questions.push({
        type: "input",
        name: "name",
        message: "Redis - Name",
        default: getConfig(generator, "name", `${generator.appname}-redis`)
    });

    questions.push({
        type: "list",
        name: "resourceGroup",
        message: "Redis - Resource Group",
        choices: az.resourceGroups(generator),
        default: getConfig(generator, "resourceGroup")
    });

    questions.push({
        type: "list",
        name: "redisLocation",
        message: "Redis - Location",
        choices: az.locations(generator),
        default: getConfig(generator, "redisLocation")
    });    

    questions.push({
        type: "list",
        name: "family",
        message: "Redis - Family",
        choices: families,
        default: getConfig(generator, "family")
    });

    questions.push({
        type: "list",
        name: "sku",
        message: (answers) => `Redis - ${answers.family} - SKU`,
        choices: (answers) => skus[answers.family],
        default: (answers) => getConfig(generator, "sku", answers.family === "P" ? "Premium" : "Basic")
    });    

    questions.push({
        type: "list",
        name: "capacity",
        message: (answers) => `Redis - ${answers.family} - ${answers.sku} - Capacity`,
        choices: (answers) => capacities[answers.family],
        default: getConfig(generator, "capacity")
    });

    questions.push({
        type: "checkbox",
        name: "features",
        message: "Redis - Features",
        choices: (answers) => answers.family === "C" ? features.C : features.C.concat(features.P),
        default: getConfig(generator, "features", [])
    });

    questions.push({
        type: "list",
        name: "vnetResourceGroup",
        message: "Redis - VNET - Resource Group",
        choices: az.resourceGroups(generator),
        default: getConfig(generator, "vnetResourceGroup"),
        when: (answers) => answers.features.includes("vnet")
    });

    questions.push({
        type: "list",
        name: "vnetName",
        message: "Redis - VNET - Name",
        choices: (answers) => az.vnets(generator, answers.vnetResourceGroup),
        default: getConfig(generator, "vnetName"),
        when: (answers) => answers.features.includes("vnet")
    });

    questions.push({
        type: "list",
        name: "vnetSubnet",
        message: "Redis - VNET - Subnet",
        choices: (answers) => az.vnetSubnets(generator, answers.vnetResourceGroup, answers.vnetName),
        default: getConfig(generator, "vnetSubnet"),
        when: (answers) => answers.features.includes("vnet")
    });

    questions.push({
        type: "input",
        name: "vnetStaticIp",
        message: (answers) => `Redis - VNET - Subnet - Static IP (${az.vnetSubnetInformation(generator, answers.vnetSubnet).addressPrefix})`,        
        default: getConfig(generator, "vnetStaticIp"),
        validate: (input, answers) => {
            var cidr = az.vnetSubnetInformation(generator, answers.vnetSubnet).addressPrefix;          
            return checkIpRange(input, cidr) ? true : `The value '${input}' is not a valid IP address or is not within '${cidr}' range`;
        },
        when: (answers) => answers.features.includes("vnet")
    });

    questions.push({
        type: "checkbox",
        name: "patchScheduleDays",
        message: "Redis - Patch schedule - Week days",
        choices: patchSchedule.weekDays,
        default: getConfig(generator, "patchScheduleDays"),
        when: (answers) => answers.features.includes("patch-schedule")
    });

    questions.push({
        type: "list",
        name: "patchScheduleTime",
        message: "Redis - Patch schedule - UTC Time to start",
        choices: patchSchedule.time,
        default: getConfig(generator, "patchScheduleTime"),
        when: (answers) => answers.features.includes("patch-schedule")
    });

    questions.push({
        type: "input",
        name: "shardCount",
        message: "Redis - Shard count",
        default: getConfig(generator, "shardCount", 1),
        when: (answers) => answers.features.includes("shard")
    });    

    return questions;
}