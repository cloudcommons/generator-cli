CREATOR                    = "CloudCommons"
APP_NAME                   = "<%= name %>"
LOCATION                   = "<%= location %>"
AKS_MANAGED_RESOURCE_GROUP = "<%= aksResourceGroup %>"
<% if (privateRegistryEnabled) { %>
DOCKER_REPO_SERVER         = "<%= dockerRepoServer %>"
DOCKER_REPO_USERNAME       = "<%= dockerRepoUser %>"
DOCKER_REPO_PASSWORD       = "<%= dockerRepoPassword %>"
DOCKER_REPO_EMAIL          = "<%= dockerRepoEmail %>"
DOCKER_SECRET_NAME         = "<%= dockerSecretName %>"
<% } %>
INGRESS_ENABLED            = <%= ingressEnabled %>
<% if (!dnsZoneEnabled) %>
INGRESS_HOSTNAME           = <%= ingressHostname%>
<% if (internalLoadBalancer) { %>
INGRESS_SUBNET             = "ingressServiceSubnet"
INGRESS_IP                 = "privateLoadBalancerIp"
<% } %
INGRESS_CHART              = "<%= ingressChart %>"
INGRESS_CHART_VERSION      = "<%= ingressChartVersion %>"
INGRESS_REPLICAS           = <%= ingressReplicas %>
INGRESS_SERVICE_SUBNET     = "<%= ingressServiceSubnet %>"
APP_IMAGE_REPOSITORY       = "<%= imageName %>"
APP_IMAGE_TAG              = "<%= imageTag %>"
APP_IMAGE_REPLICACOUNT     = "<%= imageReplicaCount %>"
APP_IMAGE_PULLPOLICY       = "<%= imagePullPolicy %>"
APP_INGRESS_TLS_ENABLED    = <%= tlsEnabled %>
CLUSTER_ISSUER             = "<%= certificateIssuer %>"
<% if (dnsZoneEnabled) { %>
DNS_ZONE_NAME              = "<%= dnsZoneName %>"
DNS_ZONE_RESOURCE_GROUP    = "<%= dnsZoneResourceGroup %>"
DNS_ZONE_RECORD            = "<%= dnsZoneRecord %>"
DNS_TTL                    = "<%= dnsZoneRecordTtl %>"
<% } %>