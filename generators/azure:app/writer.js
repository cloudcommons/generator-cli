/**
 * Application writer
 */
module.exports = function (generator, answers) {

    var chartParts = answers.ingressChartAndVersion ? answers.ingressChartAndVersion.split(":") : null;
    var args = {
        name: answers.name,
        // Deployment
        imageName: answers.imageName,
        imageTag: answers.imageTag,
        imageReplicaCount: answers.imageReplicaCount ? imageReplicaCount : 2,
        imagePullPolicy: answers.imagePullPolicy,
        dockerRepoServer: answers.dockerRepoServer,
        dockerRepoUser: answers.dockerRepoUser,
        dockerRepoPassword: answers.dockerRepoPassword,
        dockerRepoEmail: answers.dockerRepoEmail,
        dockerSecretName: answers.dockerSecretName,
        // Ingress
        ingressEnabled: answers.features.includes("ingress"),
        internalLoadBalancer: answers.features.includes("ingress") && answers.ingressType === "internalLoadBalancer",
        location: answers.ipLocation ? answers.ipLocation : "westeurope",
        aksResourceGroup: answers.aksResourceGroup,
        ingressChart: chartParts ? chartParts[0] : null,
        ingressChartVersion: chartParts ? chartParts[1] : null,
        ingressReplicas: answers.ingressReplicas,
        ingressServiceName: answers.ingressServiceName,
        ingressServiceSubnet: answers.ingressServiceSubnet,
        // TLS
        tlsEnabled: answers.features.includes("tls"),
        certificateIssuer: answers.certificateIssuer,
        // DNS
        dnsZoneName: answers.dnsZoneName,
        dnsZoneResourceGroup: answers.dnsZoneResourceGroup,
        dnsZoneRecord: answers.dnsZoneRecord,
        dnsZoneRecordTtl: answers.dnsZoneRecordTtl
    }

    copy(generator, "LICENSE");
    copy(generator, "terraform.tfvars", args);
    copy(generator, "variables.tf", args);
    copy(generator, "outputs.tf");    
    copy(generator, "app.tf", args);
    copy(generator, "providers.tf");
    if (answers.features.includes("privateRegistry")) {
        copy(generator, "docker-secret.tf", args);
    }
    copy(generator, '__init__.tf', { version: "v0.12.18", backend: "local" });
    copy(generator, 'nginx-ingress.tf', args);
    copy(generator, 'templates/ingress.yml', args);
    copy(generator, 'ip.tf', args);
    copy(generator, 'dns.tf', args);
    copy(generator, '.gitignore');
}

/**
 * Copies a file from the source path to the exact same location in destination
 * @param {*} generator Yeoman generator
 * @param {*} source Source path
 * @param {*} parameters Object with parameters to replace
 */
function copy(generator, source, parameters) {
    generator.fs.copyTpl(
        generator.templatePath(source),
        generator.destinationPath(source),
        parameters
    );
}

/**
 * Copies a file from the source to a given destination path
 * @param {*} generator Yeoman generator
 * @param {*} source Source path
 * @param {*} destination Target path
 * @param {*} parameters Object with parameters to replace
 */
function copyTo(generator, source, destination, parameters) {
    generator.fs.copyTpl(
        generator.templatePath(source),
        generator.destinationPath(destination),
        parameters
    );
}