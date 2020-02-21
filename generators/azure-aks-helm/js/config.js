module.exports = {
    copy: function (terraform, answers, configFile = 'terraform.tfvars.json') {
        terraform.writeConfig({
            RELEASE_NAME: answers.name,
            APP_CHART: answers.chartName,
            APP_CHART_VERSION: answers.chartVersion,
            HELM_RECREATE_PODS: answers.recreatePods,
            CLUSTER_ISSUER: answers.certificateIssuer,
        }, configFile);
    }
}