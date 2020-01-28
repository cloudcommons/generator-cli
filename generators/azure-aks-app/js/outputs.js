var terraform = require('../../../common/terraform');

module.exports = {
    copy: function (fs, answers) {
        var output = {
            output: {
                FQDN: {
                    description: "Application full qualified domain name created in Kubernetes",
                    value: terraform.toVariable(`local.fqdn`)
                },
                LOAD_BALANCER_IP: {
                    description: "Application Load Balancer",
                    value: !answers.internalLoadBalancer ? terraform.toVariable(`local.ingress_load_balancer_ip`) : "N/A"
                }
            }
        }

        terraform.writeOutput(fs, output);
    }
}

