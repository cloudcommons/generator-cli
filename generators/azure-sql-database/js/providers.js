module.exports = {
    copy: function (terraform, answers) {
        
        var providers = {
            provider: {
                azurerm: {
                    version: "~> 1.41"                    
                },
            }
        }

        terraform.writeProviders(providers);
    }
}