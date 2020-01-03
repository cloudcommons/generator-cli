locals {  
  namespace = module.<%= name %>.namespace
  app_name  = "${var.APP_NAME}-${terraform.workspace}"
  tls_enabled = var.APP_INGRESS_TLS_ENABLED == true
  tls_secret_name = "tls-secret"
}

module "<%= name %>" {
  source                          = "cloudcommons/application/kubernetes"
  version                         = "0.1.2"
  APP_NAME                        = var.APP_NAME
  ENVIRONMENT                     = terraform.workspace
  DEPLOYMENT_REPLICAS             = var.APP_IMAGE_REPLICACOUNT
  DEPLOYMENT_IMAGE                = var.APP_IMAGE_REPOSITORY
  DEPLOYMENT_IMAGE_PULL_POLICY    = var.APP_IMAGE_PULLPOLICY
  DEPLOYMENT_IMAGE_PULL_SECRET    = local.docker_secret_name
  VERSIONS = [{
    hostname   = local.fqdn
    name       = "current"
    docker_tag = var.APP_IMAGE_TAG
    path       = "/"
  }]
  SERVICE_PORT = 80
  READINESS_PROBE = {
    initial_delay     = 5
    period_seconds    = 10
    failure_threshold = null
  }
  LIVENESS_PROBE = {
    initial_delay     = 5
    period_seconds    = 10
    failure_threshold = null
  }
  INGRESS_ANNOTATIONS = local.tls_enabled ? {
    "kubernetes.io/ingress.class"            = local.ingress_class
    "certmanager.k8s.io/cluster-issuer"      = var.CLUSTER_ISSUER
    "certmanager.k8s.io/acme-challenge-type" = "http01"
  } : {}
  INGRESS_TLS = local.tls_enabled ? [{
    hosts       = [local.fqdn]
    secret_name = local.tls_secret_name
  }] : []
}
