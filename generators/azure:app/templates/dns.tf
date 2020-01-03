locals {
  fqdn = local.ingress_enabled ? "${var.DNS_ZONE_RECORD}.${var.DNS_ZONE_NAME}" : null
}
resource "azurerm_dns_a_record" "<%= name %>" {
  count               = local.ingress_enabled ? 1 : 0
  name                = var.DNS_ZONE_RECORD
  zone_name           = var.DNS_ZONE_NAME
  resource_group_name = var.DNS_ZONE_RESOURCE_GROUP
  ttl                 = var.DNS_TTL
  records             = [local.ingress_load_balancer_ip]
}
