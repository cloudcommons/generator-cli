const coreProviders = require('../../../core/providers');

module.exports = {
    copy: function (terraform, answers) {
        var providers = {
            provider: {
                azurerm: coreProviders.azurerm(),
                template: coreProviders.template(),
                kubernetes: coreProviders.kubernetes(),
                helm: coreProviders.helm()
            }
        }

        terraform.writeProviders(providers);
    }
}