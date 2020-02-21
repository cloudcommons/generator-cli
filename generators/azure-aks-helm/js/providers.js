module.exports = {
    copy: function (terraform, answers) {
        
        var providers = {
            provider: {
                helm: {
                    version: "~> 0.10"                    
                },
                template: {
                    version: "~> 2.1"                    
                },                
            }
        }

        terraform.writeProviders(providers);
    }
}