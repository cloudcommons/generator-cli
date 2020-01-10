locals {
  ingress_enabled = var.INGRESS_ENABLED
  ingress_class = local.ingress_enabled ? "${var.APP_NAME}-${terraform.workspace}-ingress" : null
}

data "template_file" "ingress_chart_values_yaml" {
    template = "${file("${path.module}/templates/ingress.yml")}"
    vars = {
        INGRESS_CLASS = local.ingress_class
        INGRESS_REPLICAS = var.INGRESS_REPLICAS
        LOAD_BALANCER_IP = <%= internalLoadBalancer ? "var.INGRESS_IP" : "local.ingress_load_balancer_ip" %>
        <% if (internalLoadBalancer) %>INGRESS_SERVICE_SUBNET = var.INGRESS_SERVICE_SUBNET
    }
}

resource "helm_release" "ingress" {
    count           = local.ingress_enabled ? 1 : 0
    name            = local.ingress_class
    namespace       = local.namespace
    chart           = var.INGRESS_CHART
    version         = var.INGRESS_CHART_VERSION
    timeout         = 600
    recreate_pods   = var.HELM_RECREATE_PODS
    values          = [data.template_file.ingress_chart_values_yaml.rendered]
}