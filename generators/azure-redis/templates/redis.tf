locals {  
    isRedisPremium = var.REDIS_FAMILY == "P" ? true : false
}

resource "azurerm_redis_cache" "<%= name %>" {
  name                      = redis_name = "${var.REDIS_NAME}-${terraform.workspace}-${local.uid}"
  location                  = <%= locationReference %>
  resource_group_name       = <%= resourceGroupReference %>
  capacity                  = var.REDIS_CAPACITY
  family                    = var.REDIS_FAMILY
  sku_name                  = var.REDIS_SKU
  enable_non_ssl_port       = var.REDIS_ENABLE_NON_SSL
  minimum_tls_version       = var.REDIS_MINIMUM_TLS
  subnet_id                 = local.isRedisPremium ? var.REDIS_SUBNET_ID : null
  private_static_ip_address = local.isRedisPremium ? var.REDIS_SUBNET_IP : null
  shard_count               = local.isRedisPremium ? var.REDIS_SHARD_COUNT : null

  dynamic "patch_schedule" {
    for_each = local.isRedisPremium ? var.REDIS_PATCH_SCHEDULE : []
    content {
      day_of_week    = patch_schedule.value.day_of_week
      start_hour_utc = patch_schedule.value.start_hour_utc
    }
  }

  redis_configuration {}
}