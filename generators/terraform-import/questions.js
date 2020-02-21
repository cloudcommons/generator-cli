module.exports = function (az, resources) {
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
        choices: az.resourceGroups(),
        when: (answers) => answers.resourceType !== 'azurerm_resource_group'
    });

    questions.push({
        type: "list",
        name: "azureId",
        message: "Terraform - Import - Azure Resource",
        choices: (answers) => az.resources(answers.resourceGroup),
        when: (answers) => answers.resourceType !== 'azurerm_resource_group'
    })

    questions.push({
        type: "list",
        name: "resourceGroup",
        message: "Terraform - Import - Azure Resource Group",
        choices: az.resourceGroups("name", "id"),
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