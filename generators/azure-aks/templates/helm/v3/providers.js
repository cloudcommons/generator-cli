module.exports = {
    copy: function (terraform, answers) {
        var providers = {
            provider: {
                helm: {
                    version: "~> 1.0.0",
                    kubernetes: {
                        load_config_file: false,
                        host: terraform.toVariable(`module.${answers.name}-kubernetes.kube_config.0.host`),
                        client_certificate: terraform.toVariable(`base64decode(module.${answers.name}-kubernetes.kube_config.0.client_certificate)`),
                        client_key: terraform.toVariable(`base64decode(module.${answers.name}-kubernetes.kube_config.0.client_key)`),
                        cluster_ca_certificate: terraform.toVariable(`base64decode(module.${answers.name}-kubernetes.kube_config.0.cluster_ca_certificate)`)
                    }
                }
            }
        }

        terraform.writeProviders(providers);
    }
}