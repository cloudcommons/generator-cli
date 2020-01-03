locals {
  docker_secret_enabled = var.DOCKER_SECRET_NAME != null ? true : false
  docker_secret_name = local.docker_secret_enabled ? kubernetes_secret.<%= name %>-docker-secret[0].metadata.0.name : null
  dockercfg = {
    auths = {
      "${var.DOCKER_REPO_SERVER}" = {
        Username = var.DOCKER_REPO_USERNAME
        Password = var.DOCKER_REPO_PASSWORD
        Email    = var.DOCKER_REPO_EMAIL
      }
    }
  }
}

resource "kubernetes_secret" "docker-secret" {
  count =local.docker_secret_enabled ? 1 : 0
  metadata {
    name      = var.DOCKER_SECRET_NAME
    namespace = local.namespace
  }

  data = {
    ".dockerconfigjson" = jsonencode(local.dockercfg)
  }

  type = "kubernetes.io/dockerconfigjson"
}
