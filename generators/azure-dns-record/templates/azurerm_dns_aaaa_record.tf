resource "azurerm_dns_aaaa_record" "<%= name %>" {
  name                = var.DNS_ZONE_RECORD
  zone_name           = var.DNS_ZONE_NAME
  resource_group_name = var.DNS_ZONE_RESOURCE_GROUP
  ttl                 = var.DNS_TTL
  <% if (isRecordReference) { %>
  target_resource_id  = <%= record %>
  <% } else { %>  
  records             = <%= "var.DNS_RECORDS" %>
  <% } %>  

  tags = {
    app         = var.APP
    environment = terraform.workspace
    instance    = local.uid
  }  
}