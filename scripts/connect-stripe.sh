#!/bin/bash

# ==============================================================================
# Script: Connect Stripe to RevenueCat (CLI Helper)
# Description: Automates the Stripe CLI checks and guides the RevenueCat connection.
# Note: RevenueCat CLI does not currently support 'connecting' accounts directly
# via command line (it's a security/admin feature). This script handles the
# Stripe side and provides the exact steps for the RevenueCat dashboard.
# ==============================================================================

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== Kiwi Voice: Connect Stripe to RevenueCat ===${NC}"

# 1. Check for Stripe CLI
echo -e "\n${YELLOW}1. Checking for Stripe CLI...${NC}"
if ! command -v stripe &> /dev/null; then
    echo -e "${RED}❌ Stripe CLI not found.${NC}"
    echo "Please install it: brew install stripe/stripe-cli/stripe"
    exit 1
else
    echo -e "${GREEN}✅ Stripe CLI found.$(stripe --version)${NC}"
fi

# 2. Login to Stripe
echo -e "\n${YELLOW}2. Verifying Stripe Login...${NC}"
echo "Press Enter to open Stripe Login in your browser (or Ctrl+C to skip if logged in)..."
read
stripe login

# 3. Create Restricted Key (Simulation/Guidance)
# Since we cannot programmatically extract the secret key easily without handling sensitive output,
# we guide the user to create it with the specific permissions RevenueCat needs.

echo -e "\n${BLUE}=== INSTRUCTIONS: RevenueCat Connection ===${NC}"
echo "RevenueCat requires a Stripe Restricted API Key to process web payments."
echo "The Stripe CLI cannot grant this specific 'Connect' permission directly via a single command."

echo -e "\n${YELLOW}STEP 1: Create Stripe Restricted Key${NC}"
echo "Run this command (or do it in Dashboard):"
echo "  > https://dashboard.stripe.com/apikeys/create"
echo "  Name: 'RevenueCat Integration'"
echo "  Permissions:"
echo "    - Customers: Write"
echo "    - PaymentIntents: Write"
echo "    - SetupIntents: Write"
echo "    - PaymentMethods: Write"
echo "    - Subscriptions: Write"
echo "    - Invoices: Write"

echo -e "\n${YELLOW}STEP 2: Add to RevenueCat${NC}"
echo "1. Go to RevenueCat Dashboard > Project Settings > Apps"
echo "2. Click 'New App' -> 'Stripe'"
echo "3. Paste your Stripe Restricted Key"
echo "4. Copy the 'RevenueCat Public API Key' for Stripe"

echo -e "\n${YELLOW}STEP 3: Configure Project${NC}"
echo "Add your keys to .env:"
echo -e "${GREEN}VITE_STRIPE_PUBLIC_KEY=pk_test_...${NC}"

echo -e "\n${BLUE}=== Setup Complete (CLI Steps) ===${NC}"
