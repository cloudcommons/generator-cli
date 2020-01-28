var terraform = require('../../../common/terraform');

module.exports = {
    copy: function (fs, answers) {
        
        var providers = {
            provider: {
                azurerm: {
                    alias: "azurerm",
                    version: "~> 1.41"                    
                },
            }
        }

        terraform.writeProviders(fs, providers);
    }
}