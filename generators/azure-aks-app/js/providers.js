module.exports = {
    copy: function (terraform, answers) {
        var providers = {
            provider: {
                azurerm: {                    
                    version: "~> 1.41"
                },
                template: {
                    version: "~> 2.1"
                },
                kubernetes: {
                    version: "~> 1.10"
                },
                helm: {
                    version: "~> 0.10.4"
                }
            }
        }

        terraform.writeProviders(providers);
    }
}