module.exports = {
    copy: function (terraform, answers) {
        var output = {
            output: {
                IP_ID: {
                    description: "The Public IP ID",
                    value: terraform.toVariable(`azurerm_public_ip.${answers.name}.id`)
                },
                IP_ADDRESS: {
                    description: "The IP address value that was allocated. Note Dynamic Public IP Addresses aren't allocated until they're attached to a device (e.g. a Virtual Machine/Load Balancer). Instead you can obtain the IP Address once the Public IP has been assigned via the azurerm_public_ip Data Source.",
                    value: terraform.toVariable(`azurerm_public_ip.${answers.name}.ip_address`)
                }
            }
        }

        terraform.writeOutput(output);
    }
}                                