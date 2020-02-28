terraform {
  required_version = "<%- version %>"
  backend "remote" {
    hostname     = "<%= remoteHostname %>"
    organization = "<%= remoteOrganization %>"
    token        = "<%=  remoteToken%>"

    workspaces {
      prefix = "<%= remoteWorkspacePrefix %>"
    }
  }
}
