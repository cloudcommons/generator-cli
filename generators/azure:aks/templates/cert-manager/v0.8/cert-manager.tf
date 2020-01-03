resource "null_resource" "cert-manager" {
  provisioner "local-exec" {
      working_dir = "lets-encrypt/v0.8"
      command = "kubectl apply -f ."
  }  
}

resource "helm_release" "cert-manager" {
  name       = "cert-manager"
  repository = data.helm_repository.jetstack.metadata[0].name
  chart      = "jetstack/cert-manager"
  version    = "v0.8.0"
  namespace  = "cert-manager"
  depends_on = [module.aks-cluster1234-aks, null_resource.cert-manager]
}