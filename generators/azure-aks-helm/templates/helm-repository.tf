data "helm_repository" "<%= repositoryName %>" {
  name = "<%= repositoryName %>"
  url  = "<%= repositoryUrl %>"
}