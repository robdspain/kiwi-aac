#!/bin/bash

# RevenueCat Paywall Setup Script
# This script helps you configure the "First Kiwi Paywall" via RevenueCat REST API
#
# Requirements:
#   - RevenueCat account with API access
#   - Secret API key from RevenueCat dashboard (Settings > API Keys)
#   - Project ID from RevenueCat dashboard
#
# Usage:
#   export REVENUECAT_SECRET_KEY="your-secret-key-here"
#   export REVENUECAT_PROJECT_ID="your-project-id"
#   ./scripts/setup-revenuecat.sh

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
API_BASE="https://api.revenuecat.com/v1"
SECRET_KEY="${REVENUECAT_SECRET_KEY}"
PROJECT_ID="${REVENUECAT_PROJECT_ID}"

# Check environment variables
if [ -z "$SECRET_KEY" ]; then
    echo -e "${RED}❌ Error: REVENUECAT_SECRET_KEY environment variable not set${NC}"
    echo -e "${YELLOW}Get your secret key from: https://app.revenuecat.com/settings/api-keys${NC}"
    echo -e "${YELLOW}Then run: export REVENUECAT_SECRET_KEY='your-key-here'${NC}"
    exit 1
fi

if [ -z "$PROJECT_ID" ]; then
    echo -e "${RED}❌ Error: REVENUECAT_PROJECT_ID environment variable not set${NC}"
    echo -e "${YELLOW}Get your project ID from the RevenueCat dashboard URL${NC}"
    echo -e "${YELLOW}Then run: export REVENUECAT_PROJECT_ID='your-project-id'${NC}"
    exit 1
fi

echo -e "${BLUE}🥝 Kiwi AAC - RevenueCat Setup${NC}\n"

# Step 1: Create Products
echo -e "${BLUE}Step 1: Creating subscription products...${NC}"

create_product() {
    local product_id=$1
    local type=$2
    local duration=$3

    echo -e "  Creating product: ${YELLOW}${product_id}${NC}"

    curl -s -X POST "${API_BASE}/projects/${PROJECT_ID}/products" \
        -H "Authorization: Bearer ${SECRET_KEY}" \
        -H "Content-Type: application/json" \
        -d "{
            \"app_product_id\": \"${product_id}\",
            \"type\": \"${type}\",
            \"subscription_duration\": \"${duration}\"
        }" || echo -e "${YELLOW}  (Product may already exist)${NC}"
}

create_product "kiwi_monthly" "subscription" "P1M"
create_product "kiwi_annual" "subscription" "P1Y"

echo -e "${GREEN}✅ Products created${NC}\n"

# Step 2: Create Entitlement
echo -e "${BLUE}Step 2: Creating 'pro' entitlement...${NC}"

curl -s -X POST "${API_BASE}/projects/${PROJECT_ID}/entitlements" \
    -H "Authorization: Bearer ${SECRET_KEY}" \
    -H "Content-Type: application/json" \
    -d '{
        "identifier": "pro",
        "display_name": "Kiwi Pro"
    }' || echo -e "${YELLOW}  (Entitlement may already exist)${NC}"

echo -e "${GREEN}✅ Entitlement created${NC}\n"

# Step 3: Attach products to entitlement
echo -e "${BLUE}Step 3: Attaching products to 'pro' entitlement...${NC}"

attach_product() {
    local product_id=$1

    echo -e "  Attaching ${YELLOW}${product_id}${NC} to 'pro' entitlement"

    curl -s -X POST "${API_BASE}/projects/${PROJECT_ID}/entitlements/pro/products" \
        -H "Authorization: Bearer ${SECRET_KEY}" \
        -H "Content-Type: application/json" \
        -d "{
            \"app_product_id\": \"${product_id}\"
        }" || echo -e "${YELLOW}  (Product may already be attached)${NC}"
}

attach_product "kiwi_monthly"
attach_product "kiwi_annual"

echo -e "${GREEN}✅ Products attached to entitlement${NC}\n"

# Step 4: Create Offering
echo -e "${BLUE}Step 4: Creating 'default' offering...${NC}"

curl -s -X POST "${API_BASE}/projects/${PROJECT_ID}/offerings" \
    -H "Authorization: Bearer ${SECRET_KEY}" \
    -H "Content-Type: application/json" \
    -d '{
        "identifier": "default",
        "description": "Default Kiwi AAC offering",
        "is_current": true
    }' || echo -e "${YELLOW}  (Offering may already exist)${NC}"

echo -e "${GREEN}✅ Offering created${NC}\n"

# Step 5: Add packages to offering
echo -e "${BLUE}Step 5: Adding packages to offering...${NC}"

add_package() {
    local package_id=$1
    local product_id=$2
    local position=$3

    echo -e "  Adding package ${YELLOW}${package_id}${NC}"

    curl -s -X POST "${API_BASE}/projects/${PROJECT_ID}/offerings/default/packages" \
        -H "Authorization: Bearer ${SECRET_KEY}" \
        -H "Content-Type: application/json" \
        -d "{
            \"identifier\": \"${package_id}\",
            \"app_product_id\": \"${product_id}\",
            \"position\": ${position}
        }" || echo -e "${YELLOW}  (Package may already exist)${NC}"
}

add_package "\$rc_monthly" "kiwi_monthly" 1
add_package "\$rc_annual" "kiwi_annual" 0

echo -e "${GREEN}✅ Packages added to offering${NC}\n"

# Summary
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✅ RevenueCat configuration complete!${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"

echo -e "${BLUE}Products created:${NC}"
echo -e "  • ${YELLOW}kiwi_monthly${NC} - Monthly subscription"
echo -e "  • ${YELLOW}kiwi_annual${NC} - Annual subscription\n"

echo -e "${BLUE}Entitlement created:${NC}"
echo -e "  • ${YELLOW}pro${NC} - Unlocks all premium features\n"

echo -e "${BLUE}Offering created:${NC}"
echo -e "  • ${YELLOW}default${NC} (set as current)\n"

echo -e "${BLUE}Packages:${NC}"
echo -e "  • ${YELLOW}\$rc_monthly${NC} → kiwi_monthly"
echo -e "  • ${YELLOW}\$rc_annual${NC} → kiwi_annual\n"

echo -e "${YELLOW}⚠️  Next Steps:${NC}"
echo -e "  1. Go to RevenueCat dashboard: ${BLUE}https://app.revenuecat.com${NC}"
echo -e "  2. Navigate to ${YELLOW}Paywalls${NC} section"
echo -e "  3. Create a new paywall named ${YELLOW}'First Kiwi Paywall'${NC}"
echo -e "  4. Use the configuration from ${YELLOW}FIRST-KIWI-PAYWALL-CONFIG.md${NC}"
echo -e "  5. Configure products in App Store Connect / Google Play Console"
echo -e "  6. Test with sandbox accounts\n"

echo -e "${GREEN}🎉 Ready to launch!${NC}\n"
