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

# Load .env file if it exists
if [ -f .env ]; then
    set -a
    source .env
    set +a
fi

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
API_BASE="https://api.revenuecat.com/v2"
SECRET_KEY="${REVENUECAT_SECRET_KEY}"
PROJECT_ID="${REVENUECAT_PROJECT_ID}"
APP_ID="${REVENUECAT_APP_ID}"

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

# Resolve App ID (required for product creation)
if [ -z "$APP_ID" ]; then
    if command -v python3 >/dev/null 2>&1; then
        APP_ID=$(curl -s "${API_BASE}/projects/${PROJECT_ID}/apps" \
            -H "Authorization: Bearer ${SECRET_KEY}" \
            -H "Accept: application/json" | python3 - <<'PY'
import json,sys
data = json.load(sys.stdin)
items = data.get("items", [])
target = None
for app in items:
    name = (app.get("name") or "").lower()
    if "kiwi voice" in name:
        target = app
        break
print((target or (items[0] if items else {}) ).get("id",""))
PY
        )
    else
        echo -e "${RED}❌ Error: REVENUECAT_APP_ID not set and python3 not available${NC}"
        echo -e "${YELLOW}Set REVENUECAT_APP_ID (see RevenueCat Apps list) and re-run.${NC}"
        exit 1
    fi
fi

if [ -z "$APP_ID" ]; then
    echo -e "${RED}❌ Error: Could not resolve RevenueCat App ID${NC}"
    echo -e "${YELLOW}Set REVENUECAT_APP_ID manually and re-run.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Using RevenueCat App ID: ${APP_ID}${NC}\n"

# Step 1: Create Products
echo -e "${BLUE}Step 1: Creating subscription products...${NC}"

create_product() {
    local product_id=$1
    local display_name=$2
    local type=$3

    echo -e "  Creating product: ${YELLOW}${product_id}${NC}"

    curl -s -X POST "${API_BASE}/projects/${PROJECT_ID}/products" \
        -H "Authorization: Bearer ${SECRET_KEY}" \
        -H "Content-Type: application/json" \
        -d "{
            \"app_id\": \"${APP_ID}\",
            \"store_identifier\": \"${product_id}\",
            \"display_name\": \"${display_name}\",
            \"type\": \"${type}\"
        }" || echo -e "${YELLOW}  (Product may already exist)${NC}"
}

create_product "kiwi_monthly" "Monthly" "subscription"
create_product "kiwi_annual" "Annual" "subscription"
create_product "kiwi_lifetime" "Lifetime" "one_time"

echo -e "${GREEN}✅ Products created${NC}\n"

# Step 2: Create Entitlement
echo -e "${BLUE}Step 2: Creating 'pro' entitlement...${NC}"

curl -s -X POST "${API_BASE}/projects/${PROJECT_ID}/entitlements" \
    -H "Authorization: Bearer ${SECRET_KEY}" \
    -H "Content-Type: application/json" \
    -d '{
        "lookup_key": "pro",
        "display_name": "Pro"
    }' || echo -e "${YELLOW}  (Entitlement may already exist)${NC}"

echo -e "${GREEN}✅ Entitlement created${NC}\n"

# Step 3: Attach products to entitlement
echo -e "${BLUE}Step 3: Attach products to 'pro' entitlement (manual)...${NC}"
echo -e "${YELLOW}RevenueCat v2 does not allow API linking. Do this in the dashboard:${NC}"
echo -e "  - Entitlements → pro → Attach products: kiwi_monthly, kiwi_annual, kiwi_lifetime\n"

# Step 4: Create Offering
echo -e "${BLUE}Step 4: Creating 'default' offering...${NC}"

curl -s -X POST "${API_BASE}/projects/${PROJECT_ID}/offerings" \
    -H "Authorization: Bearer ${SECRET_KEY}" \
    -H "Content-Type: application/json" \
    -d '{
        "lookup_key": "default",
        "display_name": "Default Offering"
    }' || echo -e "${YELLOW}  (Offering may already exist)${NC}"

echo -e "${GREEN}✅ Offering created${NC}\n"

# Step 5: Add packages to offering
echo -e "${BLUE}Step 5: Adding packages to offering...${NC}"

OFFERING_ID=$(curl -s "${API_BASE}/projects/${PROJECT_ID}/offerings" \
    -H "Authorization: Bearer ${SECRET_KEY}" \
    -H "Accept: application/json" | python3 - <<'PY'
import json,sys
data = json.load(sys.stdin)
items = data.get("items", [])
match = next((item for item in items if item.get("lookup_key") == "default"), None)
print((match or {}).get("id",""))
PY
)

add_package() {
    local package_id=$1
    local label=$2
    local position=$3

    echo -e "  Adding package ${YELLOW}${package_id}${NC}"

    curl -s -X POST "${API_BASE}/projects/${PROJECT_ID}/offerings/${OFFERING_ID}/packages" \
        -H "Authorization: Bearer ${SECRET_KEY}" \
        -H "Content-Type: application/json" \
        -d "{
            \"lookup_key\": \"${package_id}\",
            \"display_name\": \"${label}\",
            \"position\": ${position}
        }" || echo -e "${YELLOW}  (Package may already exist)${NC}"
}

if [ -z "$OFFERING_ID" ]; then
    echo -e "${YELLOW}  (Could not resolve default offering ID; skip package creation)${NC}"
else
    add_package "\$rc_monthly" "Monthly" 1
    add_package "\$rc_annual" "Annual" 0
    add_package "\$rc_lifetime" "Lifetime" 2
fi

echo -e "${GREEN}✅ Packages added to offering${NC}\n"

# Summary
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✅ RevenueCat configuration complete!${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"

echo -e "${BLUE}Products created:${NC}"
echo -e "  • ${YELLOW}kiwi_monthly${NC} - Monthly subscription"
echo -e "  • ${YELLOW}kiwi_annual${NC} - Annual subscription"
echo -e "  • ${YELLOW}kiwi_lifetime${NC} - Lifetime purchase\n"

echo -e "${BLUE}Entitlement created:${NC}"
echo -e "  • ${YELLOW}pro${NC} - Unlocks all premium features\n"

echo -e "${BLUE}Offering created:${NC}"
echo -e "  • ${YELLOW}default${NC} (set as current in dashboard if needed)\n"

echo -e "${BLUE}Packages:${NC}"
echo -e "  • ${YELLOW}\$rc_monthly${NC} → kiwi_monthly"
echo -e "  • ${YELLOW}\$rc_annual${NC} → kiwi_annual"
echo -e "  • ${YELLOW}\$rc_lifetime${NC} → kiwi_lifetime\n"

echo -e "${YELLOW}⚠️  Next Steps:${NC}"
echo -e "  1. Go to RevenueCat dashboard: ${BLUE}https://app.revenuecat.com${NC}"
echo -e "  2. Entitlements → ${YELLOW}pro${NC} → attach kiwi_monthly, kiwi_annual, kiwi_lifetime"
echo -e "  3. Offerings → ${YELLOW}default${NC} → link packages to products"
echo -e "  4. Paywalls → create ${YELLOW}'First Kiwi Paywall'${NC}"
echo -e "  5. Use ${YELLOW}PAYWALL-SETUP-README.md${NC} for copy"
echo -e "  6. Configure products in App Store Connect / Google Play Console"
echo -e "  7. Test with sandbox accounts\n"

echo -e "${GREEN}🎉 Ready to launch!${NC}\n"
