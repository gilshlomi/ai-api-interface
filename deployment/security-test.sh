#!/bin/bash

# Security Test Script for AI API Interface
# This script performs basic security tests for the application

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Display banner
echo -e "${GREEN}"
echo "====================================================="
echo "  AI API Interface - Security Test Script"
echo "====================================================="
echo -e "${NC}"

# Check if backend is running
echo -e "${YELLOW}Checking if backend is running...${NC}"

# Check backend
cd ../backend
if ! npm run dev > /dev/null 2>&1 & BACKEND_PID=$!; then
  echo -e "${RED}Error: Failed to start backend server${NC}"
  exit 1
fi
echo -e "${GREEN}Backend server started with PID $BACKEND_PID${NC}"
sleep 5

# Test 1: Authentication Required
echo -e "${YELLOW}Test 1: Verifying authentication is required for protected endpoints...${NC}"
AUTH_TEST=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3001/api/connections)
if [[ $AUTH_TEST == "401" ]]; then
  echo -e "${GREEN}Authentication requirement test passed${NC}"
else
  echo -e "${RED}Authentication requirement test failed - Protected endpoint accessible without authentication${NC}"
  kill $BACKEND_PID
  exit 1
fi

# Test 2: Password Strength
echo -e "${YELLOW}Test 2: Testing password strength requirements...${NC}"
WEAK_PASSWORD=$(curl -s -X POST http://localhost:3001/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"weakuser","email":"weak@example.com","password":"weak"}')

if [[ $WEAK_PASSWORD == *"Password must be at least 8 characters long"* ]]; then
  echo -e "${GREEN}Password strength test passed${NC}"
else
  echo -e "${RED}Password strength test failed - Weak passwords are accepted${NC}"
  kill $BACKEND_PID
  exit 1
fi

# Test 3: JWT Token Validation
echo -e "${YELLOW}Test 3: Testing JWT token validation...${NC}"
INVALID_TOKEN_TEST=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3001/api/connections \
  -H "Authorization: Bearer invalid.token.here")

if [[ $INVALID_TOKEN_TEST == "401" ]]; then
  echo -e "${GREEN}JWT token validation test passed${NC}"
else
  echo -e "${RED}JWT token validation test failed - Invalid tokens are accepted${NC}"
  kill $BACKEND_PID
  exit 1
fi

# Test 4: Register valid user for further tests
echo -e "${YELLOW}Registering test user for further tests...${NC}"
REGISTER_RESPONSE=$(curl -s -X POST http://localhost:3001/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"securitytest","email":"security@example.com","password":"securePassword123"}')

# Login to get token
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"security@example.com","password":"securePassword123"}')

TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"token":"[^"]*' | cut -d'"' -f4)

# Test 5: API Key Protection
echo -e "${YELLOW}Test 5: Testing API key protection...${NC}"
# Create a connection with API key
CREATE_CONN_RESPONSE=$(curl -s -X POST http://localhost:3001/api/connections \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"name":"Security Test API","endpoint":"https://api.example.com","authType":"apiKey","apiKey":"test-api-key-12345"}')

# Get connections and check if API key is masked
GET_CONN_RESPONSE=$(curl -s -X GET http://localhost:3001/api/connections \
  -H "Authorization: Bearer $TOKEN")

if [[ $GET_CONN_RESPONSE == *"test-api-key-12345"* ]]; then
  echo -e "${RED}API key protection test failed - API keys are exposed in responses${NC}"
  kill $BACKEND_PID
  exit 1
else
  echo -e "${GREEN}API key protection test passed${NC}"
fi

# Clean up
echo -e "${YELLOW}Cleaning up...${NC}"
kill $BACKEND_PID

echo -e "${GREEN}"
echo "====================================================="
echo "  All security tests passed successfully!"
echo "====================================================="
echo -e "${NC}"
