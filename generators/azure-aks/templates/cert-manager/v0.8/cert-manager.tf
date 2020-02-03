resource "local_file" "kubeconfig" {
  sensitive_content = module.<%= name %>-kubernetes.kube_config_raw
  filename = "cert-manager/v0.8/.kube/config"
}

resource "null_resource" "cert_manager" {
  provisioner "local-exec" {
    working_dir = "cert-manager/v0.8"
    command     = "kubectl apply -f crds.yml --kubeconfig ./.kube/config && kubectl apply -f cluster-issuer.yml --kubeconfig ./.kube/config"
  }
  depends_on = [module.<%= name %>-kubernetes, local_file.kubeconfig]
}

resource "helm_release" "cert-manager" {
  name       = "cert-manager"
  repository = data.helm_repository.jetstack.metadata[0].name
  chart      = "jetstack/cert-manager"
  version    = "v0.8.0"
  namespace  = "cert-manager"
  depends_on = [module.<%= name %>-kubernetes, null_resource.cert_manager]
}
