APP                     = "<%= name %>"
CREATOR                 = "cloudcommons"
KUBERNETES_CLUSTER_NAME = "<%= name %>"
LOCATION                = "<%= location %>"
ADMIN_USER              = "<%= adminUser %>"
SSH_KEY                 = "<%= sshKey %>"
KUBERNETES_VERSION      = "<%= kubernetesVersion %>"
KUBERNETES_AGENT_COUNT  = <%= vms %>
KUBERNETES_VM_SIZE      = "<%= vmsize %>"
OS_DISK_SIZE_GB         = 60
KUBERNETES_CLIENT_ID    = "<%= clientId %>"
KUBERNETES_CLIENT_SECRET= "<%= clientSecret %>"
ACR_ENABLED             = <%= acrEnabled %>
ACR_NAME                = "<%= acrName %>"
ACR_SKU                 = "<%= acrSku %>"
DNS_ZONE_ENABLED        = <%= dnsZoneEnabled %>
DNS_ZONE_NAME           = "<%= dnsZoneName %>"
RBAC_ENABLED            = <%= rbacEnabled %>