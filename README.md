[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fcloudcommons%2Fgenerator-cli.svg?type=shield)](https://app.fossa.com/projects/git%2Bgithub.com%2Fcloudcommons%2Fgenerator-cli?ref=badge_shield)

# Cloudcommons CLI

CloudCommons is a toolbox that aims to hold common patterns and practices for cloud applications.

This CLI, based on Yeoman (yeoman/yo), provides you with common Terraform scafolding for Microsoft Azure, relaying on various CloudCommons projects.

AWS and GCP will come in the future. Contributions will be welcome.

## Pre-requisites

In order to use this cli you need:
1. [azure cli](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli?view=azure-cli-latest)
2. NPM
3. Terraform v0.12.19 or v.0.12.20
4. An active Microsoft subscription
5. Perform ```az login``` before starting

## Installation

Use the following command to install the CloudCommons CLI:

``` bash
npm install -g yo @cloudcommons/cli
```

## How to use

To start the cli:

``` bash
yo @cloudcommons/cli
? What do you want to create? (Press <space> to select, <a> to toggle all, <i> to invert selection)
❯◯ Azure - Resource group
 ◯ Azure - Kubernetes
 ◯ Azure - Kubernetes - Application
 ◯ Azure - Kubernetes - Helm release
 ◯ Azure - Kubernetes - Ingress
 ◯ Azure - Storage Account
 ◯ Azure - SQL Server
(Move up and down to reveal more choices)
```

You can generate more than one Azure resource at same time.

Don't forget to use "Space" to choose at least one generator!

## Features

This generator can help you generating terraform boilerplate code to create:

* Azure AKS (with cloudcommons/terraform-azure-kubernetes)
* Azure DNS record
* Azure Static IP Address
* Azure Redis
* Azure Resource Group
* Azure Search
* Azure SQL Server
* Azure SQL Database
* Azure SQL Failover
* Azure Storage
* Kubernetes application deployment (with cloudcommons/terraform-kubernetes-application)
* Kubernetes Ingress for Azure
* Kubernetes Docker Secret
* Terraform (local, remote, azurerm)
* Terraform pipelines for Azure DevOps

## FAQ

Q: How is the generator getting information from my Azure account?
A: It invokes the Azure CLI under the hood.

Q: Is the CLI itself writing anything to my Azure subscriptions?
A: No, it only reads JSON information in order to facilitate the setup process.

Q: Is any Azure information stored?
A: Yes, some Azure information is stored in the .yo-rc file. Sensitive information (mainly password) is not stored, and you have to introduce it every time you run the generator.

Q: Which subscription is the cli using?
A: It uses az cli active subscription. To change is, use ```az account set -s xxxxxx ````

Q: Does the cli support multiple subscriptions?
A: No. Multiple subscriptions are not suported yet.

# License

MIT license

[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fcloudcommons%2Fgenerator-cli.svg?type=large)](https://app.fossa.com/projects/git%2Bgithub.com%2Fcloudcommons%2Fgenerator-cli?ref=badge_large)