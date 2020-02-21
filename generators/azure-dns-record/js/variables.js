module.exports = {
    copy: function (terraform, answers, configFile = 'variables.tf.json') {
        var variables = {
            "variable": {
                DNS_ZONE_RECORD: {
                    type: "string",
                    description: ("(Required) The name of the DNS A Record.")
                },
                DNS_ZONE_NAME: {
                    type: "string",
                    description: ("(Required) Specifies the DNS Zone where the resource exists. Changing this forces a new resource to be created.")
                },
                DNS_ZONE_RESOURCE_GROUP: {
                    type: "string",
                    description: "(Required) Specifies the resource group where the DNS Zone (parent resource) exists. Changing this forces a new resource to be created."
                },
                DNS_TTL: {
                    type: "string",
                    description: "(Required) The Time To Live (TTL) of the DNS record in seconds."
                }
            }
        }

        if (!answers.isRecordReference) {
            variables.variable.DNS_RECORDS = {
                type: "list(string)",
                description: " (Optional) List of IPv4 Addresses. Conflicts with target_resource_id.",
                default: []
            }
        }

        terraform.writeVariables(variables);
    }
}