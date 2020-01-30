var terraform = require('../../../common/terraform');

module.exports = {
    copy: function (fs, answers) {
        var variables = {
            "variable": {
                SEARCH_NAME: {
                    type: "string",
                    description: ("(Required) The name of the Search Service. Changing this forces a new resource to be created.")
                },
                SEARCH_SKU: {
                    type: "string",
                    description: ("(Required) Valid values are basic, free and standard. standard2 and standard3 are also valid, but can only be used when it's enabled on the backend by Microsoft support. free provisions the service in shared clusters. standard provisions the service in dedicated clusters. Changing this forces a new resource to be created.")
                },
                SEARCH_REPLICA_COUNT: {
                    type: "string",
                    description: "(Optional) Default is 1. Valid values include 1 through 12. Valid only when sku is standard. Changing this forces a new resource to be created.",
                    default: null
                },
                SEARCH_PARTITION_COUNT: {
                    type: "string",
                    description: "(Optional) Default is 1. Valid values include 1, 2, 3, 4, 6, or 12. Valid only when sku is standard. Changing this forces a new resource to be created.",
                    default: null
                },
                SEARCH_APP: {
                    type: "string",
                    description: "(Optional) Application this resource belongs to",
                    default: ""
                }
            }
        }

        if (!terraform.isDependency(answers.resourceGroupReference)) {
            variables.variable = Object.assign({
                SEARCH_LOCATION: {
                    type: "string",
                    description: "(Required) Specifies the supported Azure location where the resource exists. Changing this forces a new resource to be created."
                },
                SEARCH_RESOURCE_GROUP: {
                    type: "string",
                    description: ("(Required) The name of the resource group in which to create the Search Service. Changing this forces a new resource to be created.")
                }
            }, variables.variable);
        }

        terraform.writeVariables(fs, variables);
    }
}