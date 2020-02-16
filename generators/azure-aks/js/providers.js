module.exports = {
    copy: function (terraform, answers) {
        var providers = {
            provider: {
                azurerm: {
                    version: "~> 1.41"
                },
                null: {
                    version: "~> 2.1"
                },
                local: {
                    version: "~> 1.4"
                },
                kubernetes: {
                    version: "~> 1.10",
                    host: terraform.toVariable(`module.${answers.name}-kubernetes.kube_config.0.host`),
                    client_certificate: terraform.toVariable(`base64decode(module.${answers.name}-kubernetes.kube_config.0.client_certificate)`),
                    client_key: terraform.toVariable(`base64decode(module.${answers.name}-kubernetes.kube_config.0.client_key)`),
                    cluster_ca_certificate: terraform.toVariable(`base64decode(module.${answers.name}-kubernetes.kube_config.0.cluster_ca_certificate)`)
                }
            }
        }

        terraform.writeProviders(providers);
    }
}