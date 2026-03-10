#!/bin/bash

# Backend .NET API Test Setup Script
# This script sets up the test environment for the first time

set -e

echo "====================================="
echo "Backend .NET API Test Setup"
echo "====================================="
echo ""

# Check Node.js version
echo "Checking Node.js version..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18 or higher."
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version must be 18 or higher. Current version: $(node -v)"
    exit 1
fi
echo "✓ Node.js version: $(node -v)"
echo ""

# Check npm
echo "Checking npm..."
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed."
    exit 1
fi
echo "✓ npm version: $(npm -v)"
echo ""

# Install dependencies
echo "Installing npm dependencies..."
npm install
echo "✓ Dependencies installed"
echo ""

# Install Playwright browsers
echo "Installing Playwright browsers..."
npx playwright install
echo "✓ Playwright browsers installed"
echo ""

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "Creating .env file from .env.example..."
    cp .env.example .env
    echo "✓ .env file created"
    echo "⚠️  Please update .env with your configuration"
else
    echo "✓ .env file already exists"
fi
echo ""

# Check if .NET API is available
echo "Checking .NET API availability..."
API_URL=${API_BASE_URL:-"http://localhost:5000"}
if curl -f "$API_URL/health" &> /dev/null; then
    echo "✓ .NET API is running at $API_URL"
else
    echo "⚠️  .NET API is not running at $API_URL"
    echo "   Please start the .NET API before running tests:"
    echo "   cd ../backend-dotnet/VacationPlan.API"
    echo "   dotnet run"
fi
echo ""

echo "====================================="
echo "Setup Complete!"
echo "====================================="
echo ""
echo "Next steps:"
echo "1. Start the .NET API (if not already running)"
echo "2. Update .env file with your configuration"
echo "3. Run tests with: npm test"
echo ""
echo "Available commands:"
echo "  npm test              - Run all tests"
echo "  npm run test:ui       - Run tests with UI"
echo "  npm run test:debug    - Debug tests"
echo "  npm run test:report   - View test report"
echo ""
