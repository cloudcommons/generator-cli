resource "null_resource" "atarraya" {
  provisioner "local-exec" {
    command     = "git clone https://github.com/cmendible/atarraya.git"
  }
}

resource "helm_release" "atarraya" {
  name       = "atarraya"
  chart      = "./atarraya/charts/atarraya-webhook"
  namespace  = "kube-system"
  depends_on = [module.kubernetes, null_resource.atarraya]
}