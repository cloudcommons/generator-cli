const coreProviders = require('../../../core/providers');

module.exports = {
    copy: function (terraform, answers) {
        
        var providers = {
            provider: {
                helm: coreProviders.helm(),
                template: coreProviders.template()         
            }
        }

        terraform.writeProviders(providers);
    }
}