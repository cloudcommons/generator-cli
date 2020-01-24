resource "null_resource" "cert_manager" {
  provisioner "local-exec" {
    command     = "git clone https://github.com/cmendible/atarraya.git"
  }
  depends_on = [module.kubernetes, local_file.kubeconfig]
}

resource "helm_release" "atarraya" {
  name       = "atarraya"
  chart      = "./atarraya/charts/atarraya-webhook"
  namespace  = "kube-system"
  depends_on = [module.kubernetes, null_resource.cert_manager]
}