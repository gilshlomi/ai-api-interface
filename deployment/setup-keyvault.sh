#!/bin/bash

# Setup Key Vault for AI API Interface
# This script sets up Azure Key Vault and stores necessary secrets

# Exit on error
set -e

# Check arguments
if [ "$#" -lt 3 ]; then
    echo "Usage: $0 <resource-group> <app-name> <environment>"
    exit 1
fi

# Configuration
RESOURCE_GROUP=$1
APP_NAME=$2
ENVIRONMENT=$3
KEY_VAULT_NAME="${APP_NAME}-kv-${ENVIRONMENT}-$(az group show --name $RESOURCE_GROUP --query id --output tsv | md5sum | cut -c1-8)"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Setting up Key Vault $KEY_VAULT_NAME...${NC}"

# Get current user object ID for Key Vault access policy
USER_OBJECT_ID=$(az ad signed-in-user show --query id --output tsv)

# Set access policy for current user
echo -e "${YELLOW}Setting access policy for current user...${NC}"
az keyvault set-policy --name "$KEY_VAULT_NAME" \
    --resource-group "$RESOURCE_GROUP" \
    --object-id "$USER_OBJECT_ID" \
    --secret-permissions get list set delete backup restore recover purge

# Get the backend app's managed identity object ID
BACKEND_APP_NAME="${APP_NAME}-backend-${ENVIRONMENT}"
BACKEND_IDENTITY=$(az webapp identity assign --name "$BACKEND_APP_NAME" --resource-group "$RESOURCE_GROUP" --query principalId --output tsv)

# Set access policy for backend app's managed identity
echo -e "${YELLOW}Setting access policy for backend app's managed identity...${NC}"
az keyvault set-policy --name "$KEY_VAULT_NAME" \
    --resource-group "$RESOURCE_GROUP" \
    --object-id "$BACKEND_IDENTITY" \
    --secret-permissions get list

# Add secrets to Key Vault
echo -e "${YELLOW}Adding secrets to Key Vault...${NC}"

# JWT Secret
JWT_SECRET=$(openssl rand -base64 32)
az keyvault secret set --vault-name "$KEY_VAULT_NAME" \
    --name "JWT-SECRET" \
    --value "$JWT_SECRET"

# Database connection string (placeholder for future implementation)
az keyvault secret set --vault-name "$KEY_VAULT_NAME" \
    --name "DATABASE-CONNECTION-STRING" \
    --value "placeholder-connection-string"

# API rate limit
az keyvault secret set --vault-name "$KEY_VAULT_NAME" \
    --name "API-RATE-LIMIT" \
    --value "100"

echo -e "${GREEN}Key Vault setup completed successfully!${NC}"
echo -e "Key Vault Name: ${GREEN}$KEY_VAULT_NAME${NC}"
