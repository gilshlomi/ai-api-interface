# Azure Deployment Scripts for AI API Interface

This directory contains scripts and templates for deploying the AI API Interface to Azure.

## Deployment Architecture

The application will be deployed using the following Azure services:

- **Azure App Service**: For hosting both the frontend and backend applications
- **Azure Key Vault**: For securely storing API keys and credentials
- **Azure Application Insights**: For monitoring and logging
- **Azure Storage Account**: For storing application data

## Prerequisites

- Azure CLI installed and configured
- Azure subscription
- Node.js and npm installed

## Deployment Steps

1. Configure Azure resources using the provided ARM template
2. Build the frontend and backend applications
3. Deploy the applications to Azure App Service
4. Configure environment variables and secrets
5. Verify the deployment

## Scripts

- `deploy.sh`: Main deployment script
- `azure-resources.bicep`: Bicep template for Azure resources
- `azure-resources.parameters.json`: Parameters for the Bicep template
- `setup-keyvault.sh`: Script to set up Azure Key Vault and store secrets
