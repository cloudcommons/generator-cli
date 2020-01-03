provider "azurerm" {
  version = "1.39"
}

provider "kubernetes" {
  version                = "1.10"
  host                   = module.<%= name %>-aks.kube_config.0.host
  client_certificate     = base64decode(module.<%= name %>-aks.kube_config.0.client_certificate)
  client_key             = base64decode(module.<%= name %>-aks.kube_config.0.client_key)
  cluster_ca_certificate = base64decode(module.<%= name %>-aks.kube_config.0.cluster_ca_certificate)
}

provider "helm" {
  version          = "0.10"
  service_account  = "tiller" // For helm v2.0
  kubernetes {
    host                   = module.<%= name %>-aks.kube_config.0.host
    client_certificate     = base64decode(module.<%= name %>-aks.kube_config.0.client_certificate)
    client_key             = base64decode(module.<%= name %>-aks.kube_config.0.client_key)
    cluster_ca_certificate = base64decode(module.<%= name %>-aks.kube_config.0.cluster_ca_certificate)
  }
}