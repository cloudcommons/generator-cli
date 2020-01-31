var resources = require('../../common/resources');
var az = require('../../common/az');
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
        type: "list",
        name: "resourceType",
        message: "Terraform - Import - Type",
        choices: resources.keys()
    });

    questions.push({
        type: "list",
        name: "resourceName",
        message: "Terraform - Import - Resource",
        choices: (answers) => resources.get(answers.resourceType)
    });

    questions.push({
        type: "list",
        name: "resourceGroup",
        message: "Terraform - Import - Azure Resource Group",
        choices: az.resourceGroups(generator),
        when: (answers) => answers.resourceType !== 'azurerm_resource_group'
    });

    questions.push({
        type: "list",
        name: "azureId",
        message: "Terraform - Import - Azure Resource",
        choices: (answers) => az.resources(generator, answers.resourceGroup),
        when: (answers) => answers.resourceType !== 'azurerm_resource_group'
    })

    questions.push({
        type: "list",
        name: "resourceGroup",
        message: "Terraform - Import - Azure Resource Group",
        choices: az.resourceGroups(generator, "name", "id"),
        when: (answers) => answers.resourceType === 'azurerm_resource_group'
    })      

    questions.push({
        type: "list",
        name: "azureId",
        message: "Terraform - Import - Azure Resource",
        choices: (answers) => [answers.resourceGroup],
        default: (answers) => answers.resourceGroup,
        when: (answers) => answers.resourceType === 'azurerm_resource_group'
    })    

    return questions;
}