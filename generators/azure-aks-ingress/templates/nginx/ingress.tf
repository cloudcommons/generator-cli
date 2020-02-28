locals {
  ingress_enabled = var.INGRESS_ENABLED
  ingress_class = local.ingress_enabled ? "${var.APP}-${var.ENVIRONMENT}-ingress-${local.uid}" : null
  ingress_load_balancer_ip = <%- loadBalancerIpReference %>
}

data "template_file" "ingress_chart_values_yaml" {
    template = "${file("${path.module}/templates/<%= name %>-ingress.yml")}"
    vars = {
        INGRESS_CLASS = local.ingress_class
        INGRESS_REPLICAS = var.INGRESS_REPLICAS
        LOAD_BALANCER_IP = <%= internalLoadBalancer ? "var.INGRESS_IP" : "local.ingress_load_balancer_ip" %>
        <% if (internalLoadBalancer) %>INGRESS_SERVICE_SUBNET = var.INGRESS_SERVICE_SUBNET
    }
}

resource "helm_release" "<%= name %>-ingress" {
    count           = local.ingress_enabled ? 1 : 0
    name            = local.ingress_class
    namespace       = "<%= inamespace %>-${var.ENVIRONMENT}-${local.uid}"
    chart           = var.INGRESS_CHART
    version         = var.INGRESS_CHART_VERSION
    timeout         = 600
    recreate_pods   = var.INGRESS_RECREATE_PODS
    values          = [data.template_file.ingress_chart_values_yaml.rendered]
}