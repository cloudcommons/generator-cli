const coreProviders = require('../../../core/providers');

module.exports = {
    copy: function (terraform, answers) {
        
        var providers = {
            provider: {
                kubernetes: coreProviders.kubernetes()
            }
        }

        terraform.writeProviders(providers);
    }
}