terraform {
  required_version = "<%- version %>"
  backend "remote" {
    hostname     = "<%= remoteHostname %>"
    organization = "<%= remoteOrganization %>"

    workspaces {
      name = "<%= remoteWorkspace %>"
    }
  }
}
