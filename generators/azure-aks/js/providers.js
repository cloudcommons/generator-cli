var terraform = require('../../../common/terraform');

module.exports = {
    copy: function (fs, answers) {
        var providers = {
            provider: {
                azurerm: {
                    alias: "azurerm",
                    version: "~> 1.41"
                },
                null: {
                    version: "~> 2.1"
                },
                local: {
                    version: "~> 1.4"
                },
                kubernetes: {
                    alias: "kubernetes",
                    version: "~> 1.10",
                    host: terraform.toVariable(`module.${answers.name}-kubernetes.kube_config.0.host`),
                    client_certificate: terraform.toVariable(`base64decode(module.${answers.name}-kubernetes.kube_config.0.client_certificate)`),
                    client_key: terraform.toVariable(`base64decode(module.${answers.name}-kubernetes.kube_config.0.client_key)`),
                    cluster_ca_certificate: terraform.toVariable(`base64decode(module.${answers.name}-kubernetes.kube_config.0.cluster_ca_certificate)`)
                },
                helm: {
                    version: "~> 0.10.4",
                    install_tiller: true,
                    tiller_image: "gcr.io/kubernetes-helm/tiller:v2.16.1",
                    service_account: "tiller",
                    kubernetes: {
                        host: terraform.toVariable(`module.${answers.name}-kubernetes.kube_config.0.host`),
                        client_certificate: terraform.toVariable(`base64decode(module.${answers.name}-kubernetes.kube_config.0.client_certificate)`),
                        client_key: terraform.toVariable(`base64decode(module.${answers.name}-kubernetes.kube_config.0.client_key)`),
                        cluster_ca_certificate: terraform.toVariable(`base64decode(module.${answers.name}-kubernetes.kube_config.0.cluster_ca_certificate)`)
                    }
                }
            }
        }

        terraform.writeProviders(fs, providers);
    }
}