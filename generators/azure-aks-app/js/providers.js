var terraform = require('../../../common/terraform');

module.exports = {
    copy: function (fs, answers) {
        var providers = {
            provider: {
                azurerm: {
                    alias: "azurerm",
                    version: "~> 1.41"
                },
                template: {
                    version: "~> 2.1"
                },
                kubernetes: {
                    alias: "kubernetes",
                    version: "~> 1.10"
                },
                helm: {
                    version: "~> 0.10.4"
                }
            }
        }

        terraform.writeProviders(fs, providers);
    }
}