provider "azurerm" {
  version = "1.39"
}

provider "null" {
  version = "2.1"
}

provider "kubernetes" {
  version                = "1.10"
  host                   = module.kubernetes.kube_config.0.host
  client_certificate     = base64decode(module.kubernetes.kube_config.0.client_certificate)
  client_key             = base64decode(module.kubernetes.kube_config.0.client_key)
  cluster_ca_certificate = base64decode(module.kubernetes.kube_config.0.cluster_ca_certificate)
}

provider "helm" {
  version          = "0.10"
  service_account  = "tiller" // For helm v2.0
  tiller_image     = "gcr.io/kubernetes-helm/tiller:v2.16.1"
  kubernetes {
    host                   = module.kubernetes.kube_config.0.host
    client_certificate     = base64decode(module.kubernetes.kube_config.0.client_certificate)
    client_key             = base64decode(module.kubernetes.kube_config.0.client_key)
    cluster_ca_certificate = base64decode(module.kubernetes.kube_config.0.cluster_ca_certificate)
  }
}