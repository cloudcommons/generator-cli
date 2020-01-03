resource "kubernetes_cluster_role_binding" "tiller" {
  metadata {
    name = "tiller-cluster-rule"
  }
  role_ref {
    api_group = "rbac.authorization.k8s.io"
    kind      = "ClusterRole"
    name      = local.tiller_role
  }
  subject {
    kind      = "ServiceAccount"
    name      = local.tiller_account
    namespace = local.tiller_account_namespace
  }  
}