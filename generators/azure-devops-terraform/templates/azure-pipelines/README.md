# CloudCommons Azure DevOps pipelines

## Pre-requisistes

## Content

## How to use

## Continous Integration

## Continous Deployment

### Creating new environments

## Creating your pipelines from the command line

You can configure your pipelines from the command line by using the following commands: (Preview feature)

Extension setup:

```bash
az extension add --name azure-devops
az devops configure --defaults organization=https://dev.azure.com/myorg project=myproject
```

Pipeline configuration:

```bash
az pipelines create --name "(CI) My pipeline" --repository-type tfsgit --repository myrepo --branch master --yaml-path ".azure-pipelines-ci.yaml" --skip-first-run true
```
