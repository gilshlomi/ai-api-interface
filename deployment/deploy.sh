#!/bin/bash

# Azure Deployment Script for AI API Interface
# This script deploys the AI API Interface to Azure

# Exit on error
set -e

# Configuration
RESOURCE_GROUP="ai-api-interface-rg"
LOCATION="eastus"
SUBSCRIPTION_ID=""
APP_NAME="ai-api-interface"
ENVIRONMENT="dev"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Display banner
echo -e "${GREEN}"
echo "====================================================="
echo "  AI API Interface - Azure Deployment Script"
echo "====================================================="
echo -e "${NC}"

# Check if Azure CLI is installed
if ! command -v az &> /dev/null; then
    echo -e "${RED}Error: Azure CLI is not installed. Please install it first.${NC}"
    echo "Visit: https://docs.microsoft.com/en-us/cli/azure/install-azure-cli"
    exit 1
fi

# Check if logged in to Azure
echo -e "${YELLOW}Checking Azure login status...${NC}"
az account show &> /dev/null || {
    echo -e "${YELLOW}Not logged in to Azure. Initiating login...${NC}"
    az login
}

# Select subscription if provided
if [ ! -z "$SUBSCRIPTION_ID" ]; then
    echo -e "${YELLOW}Setting subscription to $SUBSCRIPTION_ID...${NC}"
    az account set --subscription "$SUBSCRIPTION_ID"
fi

# Create resource group if it doesn't exist
echo -e "${YELLOW}Checking if resource group exists...${NC}"
if ! az group show --name "$RESOURCE_GROUP" &> /dev/null; then
    echo -e "${YELLOW}Creating resource group $RESOURCE_GROUP in $LOCATION...${NC}"
    az group create --name "$RESOURCE_GROUP" --location "$LOCATION"
else
    echo -e "${GREEN}Resource group $RESOURCE_GROUP already exists.${NC}"
fi

# Deploy Azure resources using Bicep
echo -e "${YELLOW}Deploying Azure resources with Bicep...${NC}"
DEPLOYMENT_OUTPUT=$(az deployment group create \
    --resource-group "$RESOURCE_GROUP" \
    --template-file "azure-resources.bicep" \
    --parameters "azure-resources.parameters.json" \
    --parameters environmentName="$ENVIRONMENT" appName="$APP_NAME" \
    --output json)

# Extract outputs from deployment
FRONTEND_URL=$(echo $DEPLOYMENT_OUTPUT | jq -r '.properties.outputs.frontendUrl.value')
BACKEND_URL=$(echo $DEPLOYMENT_OUTPUT | jq -r '.properties.outputs.backendUrl.value')
KEY_VAULT_URI=$(echo $DEPLOYMENT_OUTPUT | jq -r '.properties.outputs.keyVaultUri.value')
STORAGE_ACCOUNT_NAME=$(echo $DEPLOYMENT_OUTPUT | jq -r '.properties.outputs.storageAccountName.value')

echo -e "${GREEN}Azure resources deployed successfully!${NC}"
echo -e "Frontend URL: ${GREEN}$FRONTEND_URL${NC}"
echo -e "Backend URL: ${GREEN}$BACKEND_URL${NC}"
echo -e "Key Vault URI: ${GREEN}$KEY_VAULT_URI${NC}"

# Set up Key Vault
echo -e "${YELLOW}Setting up Key Vault...${NC}"
./setup-keyvault.sh "$RESOURCE_GROUP" "$APP_NAME" "$ENVIRONMENT"

# Build and deploy frontend
echo -e "${YELLOW}Building frontend application...${NC}"
cd ../frontend
npm install
npm run build

echo -e "${YELLOW}Creating frontend deployment package...${NC}"
cd build
zip -r ../build.zip ./*
cd ..

echo -e "${YELLOW}Deploying frontend to Azure...${NC}"
FRONTEND_APP_NAME="${APP_NAME}-frontend-${ENVIRONMENT}"
az webapp deployment source config-zip -g "$RESOURCE_GROUP" -n "$FRONTEND_APP_NAME" --src "./build.zip"

# Build and deploy backend
echo -e "${YELLOW}Building backend application...${NC}"
cd ../backend
npm install
npm run build

echo -e "${YELLOW}Creating backend deployment package...${NC}"
cd dist
zip -r ../dist.zip ./*
cd ..

echo -e "${YELLOW}Deploying backend to Azure...${NC}"
BACKEND_APP_NAME="${APP_NAME}-backend-${ENVIRONMENT}"
az webapp deployment source config-zip -g "$RESOURCE_GROUP" -n "$BACKEND_APP_NAME" --src "./dist.zip"

echo -e "${GREEN}"
echo "====================================================="
echo "  Deployment Completed Successfully!"
echo "====================================================="
echo -e "Frontend URL: ${FRONTEND_URL}"
echo -e "Backend URL: ${BACKEND_URL}"
echo -e "${NC}"

echo -e "${YELLOW}Note: You may need to configure additional settings in the Azure portal.${NC}"
