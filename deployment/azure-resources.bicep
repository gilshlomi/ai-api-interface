param location string = resourceGroup().location
param appName string
param environmentName string = 'dev'

// Variables
var uniqueSuffix = uniqueString(resourceGroup().id)
var appServicePlanName = '${appName}-plan-${environmentName}'
var frontendAppName = '${appName}-frontend-${environmentName}'
var backendAppName = '${appName}-backend-${environmentName}'
var storageAccountName = take(replace(replace(toLower('${appName}st${environmentName}${uniqueSuffix}'), '-', ''), '_', ''), 24)
var keyVaultName = take(replace(replace(toLower('${appName}kv${environmentName}${uniqueSuffix}'), '-', ''), '_', ''), 24)
var appInsightsName = '${appName}-insights-${environmentName}'

// Storage Account
resource storageAccount 'Microsoft.Storage/storageAccounts@2024-01-01' = {
  name: storageAccountName
  location: location
  sku: {
    name: 'Standard_LRS'
  }
  kind: 'StorageV2'
  properties: {
    supportsHttpsTrafficOnly: true
    encryption: {
      services: {
        file: {
          keyType: 'Account'
          enabled: true
        }
        blob: {
          keyType: 'Account'
          enabled: true
        }
      }
      keySource: 'Microsoft.Storage'
    }
    accessTier: 'Hot'
  }
}

// Key Vault
resource keyVault 'Microsoft.KeyVault/vaults@2023-07-01' = {
  name: keyVaultName
  location: location
  properties: {
    enabledForDeployment: true
    enabledForDiskEncryption: true
    enabledForTemplateDeployment: true
    tenantId: subscription().tenantId
    accessPolicies: []
    sku: {
      name: 'standard'
      family: 'A'
    }
  }
}

// Application Insights
resource appInsights 'Microsoft.Insights/components@2020-02-02' = {
  name: appInsightsName
  location: location
  kind: 'web'
  properties: {
    Application_Type: 'web'
    Request_Source: 'rest'
  }
}

// App Service Plan
resource appServicePlan 'Microsoft.Web/serverfarms@2024-04-01' = {
  name: appServicePlanName
  location: location
  sku: {
    name: 'B1'
    tier: 'Basic'
  }
  properties: {}
}

// Frontend App Service
resource frontendAppService 'Microsoft.Web/sites@2024-04-01' = {
  name: frontendAppName
  location: location
  properties: {
    serverFarmId: appServicePlan.id
    httpsOnly: true
    siteConfig: {
      appSettings: [
        {
          name: 'APPINSIGHTS_INSTRUMENTATIONKEY'
          value: appInsights.properties.InstrumentationKey
        }
      ]
      nodeVersion: '~16'
    }
  }
}

// Backend App Service
resource backendAppService 'Microsoft.Web/sites@2024-04-01' = {
  name: backendAppName
  location: location
  properties: {
    serverFarmId: appServicePlan.id
    httpsOnly: true
    siteConfig: {
      appSettings: [
        {
          name: 'APPINSIGHTS_INSTRUMENTATIONKEY'
          value: appInsights.properties.InstrumentationKey
        }
        {
          name: 'WEBSITE_NODE_DEFAULT_VERSION'
          value: '~16'
        }
        {
          name: 'STORAGE_ACCOUNT_CONNECTION_STRING'
          value: 'DefaultEndpointsProtocol=https;AccountName=${storageAccount.name};EndpointSuffix=${environment().suffixes.storage};AccountKey=${listKeys(storageAccount.id, '2023-07-01').keys[0].value}'        }
        {
          name: 'KEY_VAULT_URI'
          value: keyVault.properties.vaultUri
        }
        {
          name: 'CORS_ORIGIN'
          value: 'https://${frontendAppService.properties.defaultHostName}'
        }
      ]
    }
  }
}

// Outputs
output frontendUrl string = 'https://${frontendAppService.properties.defaultHostName}'
output backendUrl string = 'https://${backendAppService.properties.defaultHostName}'
output keyVaultUri string = keyVault.properties.vaultUri
output storageAccountName string = storageAccount.name
