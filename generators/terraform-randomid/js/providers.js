var terraform = require('../../../common/terraform');

module.exports = {
    copy: function (fs, answers) {
        
        var providers = {
            provider: {
                random: {
                    alias: "random",
                    version: "~> 2.2"                    
                },
            }
        }

        terraform.writeProviders(fs, providers);
    }
}