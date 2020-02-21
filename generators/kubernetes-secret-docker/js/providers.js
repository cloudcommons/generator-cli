module.exports = {
    copy: function (terraform, answers) {
        
        var providers = {
            provider: {
                kubernetes: {
                    version: "1.10"                    
                }
            }
        }

        terraform.writeProviders(providers);
    }
}