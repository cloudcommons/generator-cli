provider "azurerm" {
  version = "1.39"
}

provider "kubernetes" {
  host                   = module.<%= name %>-aks.kube_config.host
  username               = module.<%= name %>-aks.kube_config.username
  password               = module.<%= name %>-aks.kube_config.password
  client_certificate     = base64decode(module.<%= name %>-aks.kube_config.client_certificate)
  client_key             = base64decode(module.<%= name %>-aks.kube_config.client_key)
  cluster_ca_certificate = base64decode(module.<%= name %>-aks.kube_config.cluster_ca_certificate)
}
