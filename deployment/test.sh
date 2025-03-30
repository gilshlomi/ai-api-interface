#!/bin/bash

# Test script for AI API Interface
# This script performs basic functionality tests for the application

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Display banner
echo -e "${GREEN}"
echo "====================================================="
echo "  AI API Interface - Functionality Test Script"
echo "====================================================="
echo -e "${NC}"

# Check if frontend and backend are running
echo -e "${YELLOW}Checking if frontend and backend are running...${NC}"

# Check frontend
cd ../frontend
if ! npm run dev -- --port 3000 > /dev/null 2>&1 & FRONTEND_PID=$!; then
  echo -e "${RED}Error: Failed to start frontend server${NC}"
  exit 1
fi
echo -e "${GREEN}Frontend server started with PID $FRONTEND_PID${NC}"
sleep 5

# Check backend
cd ../backend
if ! npm run dev > /dev/null 2>&1 & BACKEND_PID=$!; then
  echo -e "${RED}Error: Failed to start backend server${NC}"
  kill $FRONTEND_PID
  exit 1
fi
echo -e "${GREEN}Backend server started with PID $BACKEND_PID${NC}"
sleep 5

# Test backend health endpoint
echo -e "${YELLOW}Testing backend health endpoint...${NC}"
HEALTH_RESPONSE=$(curl -s http://localhost:3001/health)
if [[ $HEALTH_RESPONSE == *"ok"* ]]; then
  echo -e "${GREEN}Backend health check passed${NC}"
else
  echo -e "${RED}Backend health check failed${NC}"
  kill $FRONTEND_PID $BACKEND_PID
  exit 1
fi

# Test authentication endpoints
echo -e "${YELLOW}Testing authentication endpoints...${NC}"

# Register test user
REGISTER_RESPONSE=$(curl -s -X POST http://localhost:3001/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"password123"}')

if [[ $REGISTER_RESPONSE == *"user"* ]]; then
  echo -e "${GREEN}User registration test passed${NC}"
else
  echo -e "${RED}User registration test failed${NC}"
  kill $FRONTEND_PID $BACKEND_PID
  exit 1
fi

# Login test user
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}')

if [[ $LOGIN_RESPONSE == *"token"* ]]; then
  echo -e "${GREEN}User login test passed${NC}"
  TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"token":"[^"]*' | cut -d'"' -f4)
else
  echo -e "${RED}User login test failed${NC}"
  kill $FRONTEND_PID $BACKEND_PID
  exit 1
fi

# Test API connection endpoints
echo -e "${YELLOW}Testing API connection endpoints...${NC}"

# Add sample connections
SAMPLES_RESPONSE=$(curl -s -X POST http://localhost:3001/api/connections/samples \
  -H "Authorization: Bearer $TOKEN")

if [[ $SAMPLES_RESPONSE == *"success"* ]]; then
  echo -e "${GREEN}Adding sample connections test passed${NC}"
else
  echo -e "${RED}Adding sample connections test failed${NC}"
  kill $FRONTEND_PID $BACKEND_PID
  exit 1
fi

# Get connections
CONNECTIONS_RESPONSE=$(curl -s -X GET http://localhost:3001/api/connections \
  -H "Authorization: Bearer $TOKEN")

if [[ $CONNECTIONS_RESPONSE == *"connections"* ]]; then
  echo -e "${GREEN}Getting connections test passed${NC}"
else
  echo -e "${RED}Getting connections test failed${NC}"
  kill $FRONTEND_PID $BACKEND_PID
  exit 1
fi

# Clean up
echo -e "${YELLOW}Cleaning up...${NC}"
kill $FRONTEND_PID $BACKEND_PID

echo -e "${GREEN}"
echo "====================================================="
echo "  All tests passed successfully!"
echo "====================================================="
echo -e "${NC}"
