var terraform = require('../../../common/terraform');

module.exports = {
    copy: function (fs, answers) {
        var output = {
            output: {
                KUBE_CONFIG: {
                    description: "AKS Configuration file",
                    value: terraform.toVariable(`module.${answers.name}-kubernetes.kube_config_raw`),
                    sensitive: true
                }
            }
        }

        terraform.writeOutput(fs, output);
    }
}

