module.exports = {
    copy: function (terraform, answers, configFile = 'variables.tf.json') {
        var variables = {
            variable: {
                STORAGE_NAME: {
                    type: "string",
                    description: "(Required) Name of the storage account."
                },                
                STORAGE_ACCOUNT_KIND: {
                    type: "string",
                    description: "(Optional) Defines the Kind of account. Valid options are BlobStorage, BlockBlobStorage, FileStorage, Storage and StorageV2. Changing this forces a new resource to be created. Defaults to StorageV2.",
                    default: "StorageV2"
                },
                STORAGE_ACCOUNT_TIER: {
                    type: "string",
                    description: "(Required) Defines the Tier to use for this storage account. Valid options are Standard and Premium. For FileStorage accounts only Premium is valid. Changing this forces a new resource to be created."
                },
                STORAGE_REPLICATION_TYPE: {
                    type: "string",
                    description: "(Required) Defines the type of replication to use for this storage account. Valid options are LRS, GRS, RAGRS and ZRS."
                },
                STORAGE_ACCESS_TIER: {
                    type: "string",
                    description: "(Optional) Defines the access tier for BlobStorage, FileStorage and StorageV2 accounts. Valid options are Hot and Cool, defaults to Hot.",
                    default: "Hot"
                }
            }
        };

        if (!terraform.isDependency(answers.resourceGroup)) {
            variables.variable = Object.assign({
                RESOURCE_GROUP_NAME: {
                    type: "string",
                    description: ("(Required) The name of the resource group. Must be unique on your Azure subscription.")
                },
                LOCATION: {
                    type: "string",
                    description: (" (Required) The location where the resource group should be created. For a list of all Azure locations, please consult this link or run az account list-locations --output table.")
                }
            }, variables.variable);
        }

        terraform.writeVariables(variables);
    }
}
