const types = require('./choices/types');
const regex = require('../../core/regex');

module.exports = function (generator, az, terraform, resources, configManager) {
    var questions = [];
    
    questions.push({
        type: "input",
        name: "name",
        message: "DNS Record - Name",
        default: configManager.getDefault("name", terraform.generateKey(generator.appname)),                
        validate: terraform.validateKey,
        when: !generator.options["name"]
    });

    questions.push({
        type: "input",
        name: "recordName",
        message: "DNS Record - Record",
        default: configManager.getDefault("recordName"),
        when: !generator.options["recordName"]
    });    

    questions.push({
        type: "list",
        name: "zoneResourceGroup",
        message: "DNS Zone - Resource Group",
        choices: az.resourceGroups(),
        default: configManager.getDefault("zoneResourceGroup"),
        when: !generator.options["zoneResourceGroup"]
    });

    questions.push({
        type: "list",
        name: "zoneName",
        message: "DNS Zone - Name",
        choices: (answers) => az.dnsZones(answers.zoneResourceGroup),
        default: configManager.getDefault("zoneName"),
        when: !generator.options["zoneName"]
    });    

    questions.push({
        type: "list",
        name: "type",
        message: "DNS Record - Type",
        choices: types,
        default: configManager.getDefault("zoneName", types[0]),
        when: !generator.options["record"]
    });

    questions.push({
        type: "list",
        name: "record",
        message: "DNS Record - Record",     
        choices: ['Reference','Manual'],
        when: !generator.options["record"]
    });    

    questions.push({
        type: "input",
        name: "record",
        message: "DNS Record - Record - Reference",
        default: configManager.getDefault("record"),
        when: (answers) => !generator.options["record"] && answers.record === 'Reference'
    });

    questions.push({
        type: "input",
        name: "record",
        message: "DNS Record - Record - IPv4 or IPv6",
        validate: regex.isIpAddress,
        default: configManager.getDefault("record"),
        when: (answers) => !generator.options["record"] && answers.record === 'Manual'
    });    

    questions.push({
        type: "input",
        name: "ttl",
        message: "DNS Record - TTL",
        default: 3600,
        validate: regex.isInteger,
        when: generator.options["advanced"] !== undefined
    });

    return questions;
}