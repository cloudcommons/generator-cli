locals {
  release_name = "${var.RELEASE_NAME}-${var.ENVIRONMENT}-${local.uid}"
  namespace = "${var.RELEASE_NAME}-${var.ENVIRONMENT}-${local.uid}"
}

data "template_file" "values_yaml" {
  template = "${file("${path.module}/templates/<%= name %>-values.yml")}"
  vars = {
  }
}

resource "helm_release" "<%= name %>" {
  name          = local.release_name
  namespace     = local.namespace
  repository    = data.helm_repository.<%= repositoryName %>.metadata[0].name
  chart         = var.APP_CHART
  version       = var.APP_CHART_VERSION
  timeout       = 600
  recreate_pods = var.HELM_RECREATE_PODS
  values        = [data.template_file.values_yaml.rendered]
}
