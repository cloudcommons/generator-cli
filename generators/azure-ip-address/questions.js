/**
 * Gets the default value from the Yeoman storage
 * @param {*} generator 
 * @param {*} key 
 * @param {*} defaultValue 
 */
function getConfig(configManager, key, defaultValue) {
    return configManager.getDefault(key, defaultValue);
}

module.exports = function (generator, az, terraform, configManager) {
    var questions = [];

    questions.push({
        type: "input",
        name: "name",
        message: "IP - Name",
        default: getConfig(configManager, "name", terraform.generateKey(generator.appname)),
        when: !generator.options["name"],
        validate: terraform.validateKey
    });

    questions.push({
        type: "list",
        name: "resourceGroup",
        message: "IP - Resource Group",
        choices: az.resourceGroups(),
        default: getConfig(configManager, "resourceGroup"),
        when: !generator.options["resourceGroup"],
    });

    questions.push({
        type: "list",
        name: "location",
        message: "IP - Location",
        choices: az.locations(),
        default: getConfig(configManager, "location"),
        when: !generator.options["location"],
    });

    questions.push({
        type: "list",
        name: "ipVersion",
        message: "IP - Version",
        choices: ["IPv4", "IPv6"],
        default: getConfig(configManager, "ipVersion", "IPv4"),
        when: generator.options.advanced !== undefined && !generator.options["ipVersion"],
    });

    questions.push({
        type: "list",
        name: "ipAllocationmethod",
        message: "IP - Allocation method",
        choices: ["Static", "Dynamic"],
        default: getConfig(configManager, "ipAllocationmethod", "Static"),
        when: generator.options.advanced !== undefined && !generator.options["ipAllocationMethod"],
    });

    return questions;
}