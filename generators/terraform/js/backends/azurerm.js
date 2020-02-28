module.exports = { 
    copy: function(terraform, answers, file = "__init__.tf.json") {
        var backEnd = getBackend(answers);
        terraform.writeBackEnd(backEnd, file);
    }
} 

function getBackend (answers) {
    return {
        "terraform": [{
            "required_version": answers.version,
            "backend": [{
                "azurerm": {
                    "resource_group_name": answers.azureRmResourceGroup,
                    "storage_account_name": answers.azureRmStorageAccountName,
                    "container_name": answers.azureRmContainerName,
                    "key": answers.azureRmContainerKey
                }
            }]
        }]
    }
}