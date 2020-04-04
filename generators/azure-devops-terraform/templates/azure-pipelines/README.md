# CloudCommons Azure DevOps pipelines

This scafolder creates a fully functional Azure DevOps YAML pipeline to build, plan, apply and destroy two environments: dev and prod

This also mimics most of the aspects we used to have in the classic Release mechansim of Azure DevOps, including approval

## Pre-requisistes

This scaffolder require the following extensions to be installed in your Azure DevOps:

* [Terraform Build & Release Tasks, by Charles Zipp](https://marketplace.visualstudio.com/items?itemName=charleszipp.azure-pipelines-tasks-terraform)
* [Replace tokens task, by Guillaume Rouchon](https://marketplace.visualstudio.com/items?itemName=qetza.replacetokens)

> Please note that if you don't install these extensions the pipeline will fail

### What are these extensions needed for

We rely on Terraform Build & Release tasks to simplify the interaction with Terraform. Note we are not using MicrosoftLabs, as Charles Zipp's proved to work much better

We rely on Replace tokens task to inject secrets into Terraform. Note that, in the way secrets are managed in Azure DevOps, Terraform is not able to identify them and hence are not injected during the plan/apply/destroy lifecycle, even if the secrets have been configured in the pipeline.

## How to use

This scaffolder comes with two YAML pipelines:

* .azure-pipelines-ci.yaml > Continous Integration pipeline, that executes a terraform validate
* .azure-pipelines-cd.yaml > Continous Delivery pipeline, build, plan, apply and destroy the terraform scripts

### Continous Integration

The CI pipeline is quite straight forward. It simple performs a terraform validate to ensure a minimal quality on the Terraform scripts

### Continous Deployment

The CD pipeline contains the entire lifecycle of the Terraform script. It is composed of the following stages:

1. build: Turn the terraform script into an artifact the rest of the pipelines use
1. deploy to dev: This stage performs a terraform plan, apply and destroy of the development environment
1. deploy to prod: This stage performs a terraform plan, apply and destroy of the production environment

### Defining variables

This scaffolder mimics the classic Release varible concept of "Release" and "Stage" variables in the following way:

1. Any variable defined at ```azure-pipelines/vars/release.yaml``` will be injected to all deployments
1. The deployment expects that a file called ```azure-pipelines/vars/env.yaml```exists, been "env" the name of the environment

Any variable defined at ```env```level will override ```release```.

When creating a new environment, don't forget to create a yaml file for it. The pipeline will fail otherwise, as expects this file to exist.

### Creating new environments

Imagine that we want to create a new environment called "qa"

Go to .azure-pipelines-cd.yaml and add the following:

```yaml
- template: azure-pipelines/terraform/deploy.yaml
  parameters:
    name: qa
    after: [build]
    environment: <%= name %>-qa
    ensureBackend: ${{ variables.ENSURE_BACKEND }}

# Comment if you don't want to add destroy stages to your pipelines!

- template: azure-pipelines/terraform/destroy.yaml
  parameters:
    name: qa
    environment: <%= name %>-qa
    ensureBackend: ${{ variables.ENSURE_BACKEND }}
    after: [applyqa]
```

Create the file ```azure-pipelines/vars/qa.yaml```

Add all the variables that apply to the environment:

```yaml
variables:
  TF_VAR_ENVIRONMENT: qa
```

### Adding manual approvals

Please note that this pipeline won't create manual approval for you. Hence, if you execute it without creating any manual approval it will create and destroy the resources.

Please go to https://dev.azure.com/yourorg/yourprojects/_environments and create the following environments:

* <%= name %>-dev
* <%= name %>-prod

And follow Azure DevOps' [Define approvals and checks approvals](https://docs.microsoft.com/en-us/azure/devops/pipelines/process/approvals?view=azure-devops&tabs=check-pass#approvals) tutorial

## Creating pipelines programmatically

You can configure your pipelines from the command line by using the following commands: (Preview feature)

Extension setup:

```bash
az extension add --name azure-devops
az devops configure --defaults organization=https://dev.azure.com/myorg project=myproject
```

Pipeline configuration:

```bash
az pipelines create --name "(CI) My pipeline" --repository-type tfsgit --repository myrepo --branch master --yaml-path ".azure-pipelines-ci.yaml" --skip-first-run true
az pipelines create --name "(CD) My pipeline" --repository-type tfsgit --repository myrepo --branch master --yaml-path ".azure-pipelines-cd.yaml" --skip-first-run true
```

## FAQ

Q: Why the different environments are not presented sequentially, but they are parallel?
A: As of writing, there is no option to manual trigger a particular stage of the pipeline. If, let's say you want to deploy anything to production, you have the option to deploy something only to there. This is something that found really useful in classic Release, but we missed when create a sequential YAML release pipeline.

Q: Can I have Release and Stage variables?
A: Yes, you can! Please read "Defining variables"

Q: May I remove the "destroy" stage?
A: For production uses, yes, it is strongly recommended
