resource "helm_release" "letsencrypt" {
  name       = "my-cache"
  repository = data.helm_repository.jetstack.metadata[0].name
  chart      = "jetstack/cert-manager"
  version    = "v0.8.0"
  namespace  = "cert-manager"
  provisioner "local-exec" {
      working_dir = "cert-manager"
      command = "kubectl apply -f ."
  }
}