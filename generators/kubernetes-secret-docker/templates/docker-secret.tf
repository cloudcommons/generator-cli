locals {
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

resource "kubernetes_secret" "<%= name %>" {
  metadata {
    name        = "${var.DOCKER_SECRET_NAME}-docker-secret"
    namespace   = <%= kNamespace %>
  }

  data = {
    ".dockerconfigjson" = jsonencode(local.dockercfg)
  }

  type = "kubernetes.io/dockerconfigjson"
}
