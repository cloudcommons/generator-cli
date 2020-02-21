module.exports = {
    copy: function (terraform, answers) {
        var output = {
            output: {
                LOAD_BALANCER_IP: {
                    description: "Application Load Balancer",
                    value: !answers.internalLoadBalancer ? terraform.toVariable(`local.ingress_load_balancer_ip`) : null
                }
            }
        }

        terraform.writeOutput(output);
    }
}                                