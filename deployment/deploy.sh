#!/bin/bash

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

# Function to log messages
log() {
    local level=$1
    local message=$2
    timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    case $level in
        "INFO") echo -e "${GREEN}[INFO] ${timestamp} - ${message}${NC}" ;;
        "WARN") echo -e "${YELLOW}[WARN] ${timestamp} - ${message}${NC}" ;;
        "ERROR") echo -e "${RED}[ERROR] ${timestamp} - ${message}${NC}" ;;
    esac
}

# Function to check command status
check_status() {
    if [ $? -eq 0 ]; then
        log "INFO" "$1 successful"
    else
        log "ERROR" "$1 failed"
        exit 1
    fi
}

# Display banner
log "INFO" "Starting AI API Interface Deployment"
log "INFO" "====================================="

# Check if Azure CLI is installed
if ! command -v az &> /dev/null; then
    log "ERROR" "Azure CLI is not installed. Please install it first."
    echo "Visit: https://docs.microsoft.com/en-us/cli/azure/install-azure-cli"
    exit 1
fi

# Check if required tools are installed
for tool in npm zip jq; do
    if ! command -v $tool &> /dev/null; then
        log "ERROR" "$tool is required but not installed"
        exit 1
    fi
done

# Check Azure login status
log "INFO" "Checking Azure login status..."
if ! az account show &> /dev/null; then
    log "WARN" "Not logged in to Azure. Initiating login..."
    az login
    check_status "Azure login"
fi

# Select subscription if provided
if [ ! -z "$SUBSCRIPTION_ID" ]; then
    log "INFO" "Setting subscription to $SUBSCRIPTION_ID..."
    az account set --subscription "$SUBSCRIPTION_ID"
    check_status "Subscription selection"
fi

# Create resource group if it doesn't exist
log "INFO" "Checking resource group..."
if ! az group show --name "$RESOURCE_GROUP" &> /dev/null; then
    log "INFO" "Creating resource group $RESOURCE_GROUP in $LOCATION..."
    az group create --name "$RESOURCE_GROUP" --location "$LOCATION"
    check_status "Resource group creation"
else
    log "INFO" "Resource group $RESOURCE_GROUP already exists"
fi

# Deploy Azure resources using Bicep
log "INFO" "Deploying Azure resources with Bicep..."
DEPLOYMENT_OUTPUT=$(az deployment group create \
    --resource-group "$RESOURCE_GROUP" \
    --template-file "azure-resources.bicep" \
    --parameters "azure-resources.parameters.json" \
    --parameters environmentName="$ENVIRONMENT" appName="$APP_NAME" \
    --output json) || {
        log "ERROR" "Bicep deployment failed"
        exit 1
    }

# Extract deployment outputs
FRONTEND_URL=$(echo $DEPLOYMENT_OUTPUT | jq -r '.properties.outputs.frontendUrl.value')
BACKEND_URL=$(echo $DEPLOYMENT_OUTPUT | jq -r '.properties.outputs.backendUrl.value')
KEY_VAULT_URI=$(echo $DEPLOYMENT_OUTPUT | jq -r '.properties.outputs.keyVaultUri.value')

# Frontend Deployment
log "INFO" "Starting frontend deployment..."
cd ../frontend || {
    log "ERROR" "Frontend directory not found"
    exit 1
}

# Install frontend dependencies
log "INFO" "Installing frontend dependencies..."
npm install || {
    log "ERROR" "Frontend npm install failed"
    exit 1
}

# Build frontend
log "INFO" "Building frontend..."
npm run build || {
    log "ERROR" "Frontend build failed"
    exit 1
}

# Create web.config for frontend
log "INFO" "Creating frontend web.config..."
cat > ./build/web.config << EOF
<?xml version="1.0" encoding="utf-8"?>
<configuration>
    <system.webServer>
        <rewrite>
            <rules>
                <rule name="React Routes" stopProcessing="true">
                    <match url=".*" />
                    <conditions logicalGrouping="MatchAll">
                        <add input="{REQUEST_FILENAME}" matchType="IsFile" negate="true" />
                        <add input="{REQUEST_FILENAME}" matchType="IsDirectory" negate="true" />
                    </conditions>
                    <action type="Rewrite" url="/" />
                </rule>
            </rules>
        </rewrite>
        <staticContent>
            <mimeMap fileExtension=".json" mimeType="application/json" />
        </staticContent>
    </system.webServer>
</configuration>
EOF

# Create frontend deployment package
log "INFO" "Creating frontend deployment package..."
cd build && zip -r ../build.zip ./* || {
    log "ERROR" "Frontend zip creation failed"
    exit 1
}
cd ..

# Deploy frontend
FRONTEND_APP_NAME="${APP_NAME}-frontend-${ENVIRONMENT}"
log "INFO" "Deploying frontend to $FRONTEND_APP_NAME..."
az webapp deployment source config-zip \
    -g "$RESOURCE_GROUP" \
    -n "$FRONTEND_APP_NAME" \
    --src "./build.zip" || {
        log "ERROR" "Frontend deployment failed"
        exit 1
    }

# Configure frontend web app
log "INFO" "Configuring frontend web app..."
az webapp config set \
    --resource-group "$RESOURCE_GROUP" \
    --name "$FRONTEND_APP_NAME" \
    --linux-fx-version "NODE|16-lts" \
    --always-on true || {
        log "ERROR" "Frontend configuration failed"
        exit 1
    }

# Backend Deployment
log "INFO" "Starting backend deployment..."
cd ../backend || {
    log "ERROR" "Backend directory not found"
    exit 1
}

# Install backend dependencies
log "INFO" "Installing backend dependencies..."
npm install || {
    log "ERROR" "Backend npm install failed"
    exit 1
}

# Build backend
log "INFO" "Building backend..."
npm run build || {
    log "ERROR" "Backend build failed"
    exit 1
}

# Create web.config for backend
log "INFO" "Creating backend web.config..."
cat > ./dist/web.config << EOF
<?xml version="1.0" encoding="utf-8"?>
<configuration>
    <system.webServer>
        <handlers>
            <add name="iisnode" path="main.js" verb="*" modules="iisnode" />
        </handlers>
        <rewrite>
            <rules>
                <rule name="API Routes" stopProcessing="true">
                    <match url="/*" />
                    <action type="Rewrite" url="main.js" />
                </rule>
            </rules>
        </rewrite>
    </system.webServer>
</configuration>
EOF

# Create backend deployment package
log "INFO" "Creating backend deployment package..."
cd dist && zip -r ../dist.zip ./* || {
    log "ERROR" "Backend zip creation failed"
    exit 1
}
cd ..

# Deploy backend
BACKEND_APP_NAME="${APP_NAME}-backend-${ENVIRONMENT}"
log "INFO" "Deploying backend to $BACKEND_APP_NAME..."
az webapp deployment source config-zip \
    -g "$RESOURCE_GROUP" \
    -n "$BACKEND_APP_NAME" \
    --src "./dist.zip" || {
        log "ERROR" "Backend deployment failed"
        exit 1
    }

# Configure backend web app
log "INFO" "Configuring backend web app..."
az webapp config set \
    --resource-group "$RESOURCE_GROUP" \
    --name "$BACKEND_APP_NAME" \
    --linux-fx-version "NODE|16-lts" \
    --always-on true || {
        log "ERROR" "Backend configuration failed"
        exit 1
    }

# Configure app settings
log "INFO" "Setting application configurations..."

# Frontend settings
az webapp config appsettings set \
    --resource-group "$RESOURCE_GROUP" \
    --name "$FRONTEND_APP_NAME" \
    --settings \
        SCM_DO_BUILD_DURING_DEPLOYMENT=false \
        WEBSITE_NODE_DEFAULT_VERSION="~16" \
        WEBSITE_HTTPLOGGING_RETENTION_DAYS=1 || {
            log "ERROR" "Frontend settings configuration failed"
            exit 1
        }

# Backend settings
az webapp config appsettings set \
    --resource-group "$RESOURCE_GROUP" \
    --name "$BACKEND_APP_NAME" \
    --settings \
        SCM_DO_BUILD_DURING_DEPLOYMENT=false \
        WEBSITE_NODE_DEFAULT_VERSION="~16" \
        WEBSITE_HTTPLOGGING_RETENTION_DAYS=1 || {
            log "ERROR" "Backend settings configuration failed"
            exit 1
        }

# Display deployment information
log "INFO" "Deployment completed successfully!"
log "INFO" "====================================="
log "INFO" "Frontend URL: ${FRONTEND_URL}"
log "INFO" "Backend URL: ${BACKEND_URL}"
log "INFO" "Key Vault URI: ${KEY_VAULT_URI}"

# Check web app status
log "INFO" "Checking web app status..."
for app in "$FRONTEND_APP_NAME" "$BACKEND_APP_NAME"; do
    status=$(az webapp show --name "$app" --resource-group "$RESOURCE_GROUP" --query "state" -o tsv)
    log "INFO" "$app status: $status"
done

log "INFO" "Deployment script completed"