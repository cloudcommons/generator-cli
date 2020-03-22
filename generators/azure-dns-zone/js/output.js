module.exports = {
    copy: function (terraform, answers) {
        var output = {
            output: {
                DNS_ZONE_ID: {
                    description: "The resource group ID",
                    value: terraform.toVariable(`azurerm_dns_zone.${answers.name}.id`)
                },
                DNS_NAME_SERVERS: {
                    description: "(Optional) A list of values that make up the NS record for the zone.",
                    value: terraform.toVariable(`azurerm_dns_zone.${answers.name}.name_servers`)
                }                
            }
        }

        terraform.writeOutput(output);
    }
}                                