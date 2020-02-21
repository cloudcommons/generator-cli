module.exports = {
    copy: function (terraform, answers, configFile = 'terraform.tfvars.json') {

        var config = {
            INGRESS_ENABLED: answers.ingressEnabled,
            INGRESS_HOSTNAME: answers.dns,
            INGRESS_SUBNET: answers.ingressServiceSubnet,
            INGRESS_IP: answers.privateLoadBalancerIp,
            INGRESS_CHART: answers.ingressChart,
            INGRESS_CHART_VERSION: answers.ingressChartVersion,
            INGRESS_REPLICAS: answers.ingressReplicas,
            INGRESS_SERVICE_SUBNET: answers.ingressServiceSubnet
        }

        terraform.writeConfig(config, configFile);
    }
}