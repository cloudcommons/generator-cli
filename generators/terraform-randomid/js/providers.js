module.exports = {
    copy: function (terraform, answers) {
        
        var providers = {
            provider: {
                random: {
                    version: "~> 2.2"                    
                },
            }
        }

        terraform.writeProviders(providers);
    }
}