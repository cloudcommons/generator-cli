locals {
    tiller_account = kubernetes_service_account.tiller.metadata[0].name
    tiller_account_namespace = kubernetes_service_account.tiller.metadata[0].namespace
}

resource "kubernetes_service_account" "tiller" {
  metadata {
    name = "tiller"
    namespace = "kube-system"
  }
}