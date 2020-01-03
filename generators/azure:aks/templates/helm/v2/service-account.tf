locals {
    tiller_account = kubernetes_service_account.tiller.metadata[0].name
}

resource "kubernetes_service_account" "tiller" {
  metadata {
    name = "tiller"
  }
}