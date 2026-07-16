# Developer Portal GitHub Actions

The frontend and backend deploy differently:

- Frontend (`my-dev-portal`) is hosted by AWS Amplify and deploys through the Amplify GitHub App connection.
- Backend (`my-dev-portal-api`) is built as a Docker image, pushed to ECR, and deployed to ECS.

## GitHub environments

Create these GitHub Environments if they do not exist:

- `development`
- `staging`
- `production`

The backend deploy workflow resolves environments like this:

- `develop` branch -> `development`
- `staging` branch -> `staging`
- `main` branch -> `production`
- manual runs can choose any of the three environments

## Required environment variables

Set these as GitHub Environment variables for each environment:

| Variable | Description |
| --- | --- |
| `AWS_REGION` | AWS region, for example `eu-central-1`. |
| `AWS_ROLE_ARN` | IAM role assumed by GitHub Actions through OIDC. |
| `ECR_REPOSITORY` | ECR repository name for the backend API image. |
| `ECS_CLUSTER` | ECS cluster name. Use `moesif-developer-portal`. |
| `ECS_SERVICE` | ECS service name for that environment. |
| `ECS_TASK_DEFINITION_FAMILY` | ECS task definition family for that environment. |
| `ECS_CONTAINER_NAME` | Container name in the task definition. Use `portal-api`. |

## Current Terraform-backed values

### Staging

```text
AWS_REGION=eu-central-1
ECR_REPOSITORY=moesif-developer-portal-staging
ECS_CLUSTER=moesif-developer-portal
ECS_SERVICE=moesif-developer-portal-staging
ECS_TASK_DEFINITION_FAMILY=moesif-developer-portal-staging
ECS_CONTAINER_NAME=portal-api
```

### Production

```text
AWS_REGION=eu-central-1
ECR_REPOSITORY=moesif-developer-portal-prod
ECS_CLUSTER=moesif-developer-portal
ECS_SERVICE=moesif-developer-portal-prod
ECS_TASK_DEFINITION_FAMILY=moesif-developer-portal-prod
ECS_CONTAINER_NAME=portal-api
```

Development values should be added once its Terraform environment exists.

## Required AWS role permissions

The GitHub Actions role needs enough access to:

- push images to the configured ECR repository
- read and register ECS task definitions
- update the ECS service
- pass the ECS task roles used by the task definition

Use OIDC rather than long-lived AWS access keys.
