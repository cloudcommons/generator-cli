locals {
  tiller_role = kubernetes_cluster_role.tiller.metadata[0].name
}

resource "kubernetes_cluster_role" "tiller" {
  metadata {
    name      = "tiller"    
    annotations = {
      "rbac.authorization.kubernetes.io/autoupdate" = "true"
    }
    labels = {
      "kubernetes.io/bootstrapping" = "rbac-defaults"
    }
  }

  rule {
    api_groups        = ["*"]
    resources         = ["*"]    
    verbs             = ["*"]
  }
}
