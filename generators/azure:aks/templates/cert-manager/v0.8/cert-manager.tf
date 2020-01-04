resource "null_resource" "cert-manager" {
  provisioner "local-exec" {
    working_dir = "cert-manager/v0.8"
    command     = "az aks get-credentials -g $resource_group -n $name && kubectl apply -f ."
    environment = {
      name           = local.name
      resource_group = local.resource_group
    }
  }
  depends_on = [module.kubernetes]
}

resource "helm_release" "cert-manager" {
  name       = "cert-manager"
  repository = data.helm_repository.jetstack.metadata[0].name
  chart      = "jetstack/cert-manager"
  version    = "v0.8.0"
  namespace  = "cert-manager"
  depends_on = [module.kubernetes, null_resource.cert-manager]
}
