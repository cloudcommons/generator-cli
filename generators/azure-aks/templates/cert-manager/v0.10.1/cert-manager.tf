resource "kubernetes_namespace" "cert-manager" {
  metadata {
    name = "cert-manager" 
  }
}

resource "helm_release" "cert_manager_crds" {
  name       = "cert-manager-crds"  
  chart      = "./cert-manager/v0.10.1/crds"
  namespace  = kubernetes_namespace.cert-manager.metadata[0].name
  depends_on = [module.<%= name %>-kubernetes]
}

resource "helm_release" "cert-manager" {
  name       = "cert-manager"
  repository = data.helm_repository.jetstack.metadata[0].name
  chart      = "cert-manager"
  version    = "v0.10.1"
  namespace  = kubernetes_namespace.cert-manager.metadata[0].name
  depends_on = [module.<%= name %>-kubernetes, helm_release.cert_manager_crds <%= useHelm2 ? ", kubernetes_cluster_role_binding.tiller" : "" %>]
}
