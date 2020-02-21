module.exports = {
    copy: function (terraform, answers) {
        
        var providers = {
            provider: {
                helm: {
                    version: "~> 1.0"                    
                },
                template: {
                    version: "~> 2.1"                    
                },                
            }
        }

        terraform.writeProviders(providers);
    }
}