const coreProviders = require('../../../core/providers');

module.exports = {
    copy: function (terraform, answers) {
        
        var providers = {
            provider: {
                azurerm: coreProviders.azurerm()
            }
        }

        terraform.writeProviders(providers);
    }
}