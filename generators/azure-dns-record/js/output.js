module.exports = {
    copy: function (terraform, answers) {
        var output = {
            output: {
                DNS_ID: {
                    description: "The resource group ID",
                    value: terraform.toVariable(`azurerm_dns_${answers.type}_record.${answers.name}.id`)
                },
                DNS_FQDN: {
                    description: "The FQDN of the DNS Record",
                    value: terraform.toVariable(`azurerm_dns_${answers.type}_record.${answers.name}.fqdn`)
                }                
            }
        }

        terraform.writeOutput(output);
    }
}                                