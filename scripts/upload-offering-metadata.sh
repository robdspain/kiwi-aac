#!/bin/bash

# Upload Paywall Metadata to RevenueCat Offering
# This attaches JSON metadata to your offering, which can be used
# to drive custom paywall UI in your app
#
# Usage:
#   export REVENUECAT_SECRET_KEY="strp_ePYKboHXqhgmcCNvcHhTSDCRXpL"
#   export REVENUECAT_PROJECT_ID="proj31d3aec2"
#   ./scripts/upload-offering-metadata.sh

set -e

# Load .env file if it exists
if [ -f .env ]; then
    set -a
    source .env
    set +a
fi

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

API_BASE="https://api.revenuecat.com/v2"
SECRET_KEY="${REVENUECAT_SECRET_KEY}"
PROJECT_ID="${REVENUECAT_PROJECT_ID}"

if [ -z "$SECRET_KEY" ] || [ -z "$PROJECT_ID" ]; then
    echo -e "${RED}❌ Error: Environment variables not set${NC}"
    echo -e "${YELLOW}Run: export REVENUECAT_SECRET_KEY='your-key'${NC}"
    echo -e "${YELLOW}Run: export REVENUECAT_PROJECT_ID='your-project-id'${NC}"
    exit 1
fi

echo -e "${BLUE}🥝 Uploading Kiwi Paywall Metadata to RevenueCat Offering${NC}\n"

# Read the JSON config
PAYWALL_JSON=$(cat paywall-dashboard-config.json)

# Resolve default offering ID
if ! command -v python3 >/dev/null 2>&1; then
    echo -e "${RED}❌ Error: python3 is required to resolve offering ID${NC}"
    exit 1
fi

OFFERINGS_JSON=$(curl -s "${API_BASE}/projects/${PROJECT_ID}/offerings" \
    -H "Authorization: Bearer ${SECRET_KEY}" \
    -H "Accept: application/json")

if [ -z "$OFFERINGS_JSON" ]; then
    echo -e "${RED}❌ Error: Empty response from RevenueCat offerings endpoint${NC}"
    exit 1
fi

OFFERING_ID=$(printf '%s' "$OFFERINGS_JSON" | python3 - <<'PY'
import json,sys
text = sys.stdin.read().strip()
if not text:
    sys.exit(1)
try:
    data = json.loads(text)
except Exception:
    sys.exit(1)
items = data.get("items", [])
match = next((item for item in items if item.get("lookup_key") == "default"), None)
if match:
    print(match.get("id", ""))
PY
)

if [ -z "$OFFERING_ID" ]; then
    echo -e "${RED}❌ Error: Could not parse offerings response${NC}"
    echo -e "${YELLOW}Response:${NC} ${OFFERINGS_JSON}"
    exit 1
fi

if [ -z "$OFFERING_ID" ]; then
    echo -e "${RED}❌ Error: Could not resolve 'default' offering ID${NC}"
    exit 1
fi

# Update the 'default' offering with metadata
echo -e "${BLUE}Attaching paywall configuration to 'default' offering...${NC}"

curl -X PATCH "${API_BASE}/projects/${PROJECT_ID}/offerings/${OFFERING_ID}" \
    -H "Authorization: Bearer ${SECRET_KEY}" \
    -H "Content-Type: application/json" \
    -d "{
        \"metadata\": ${PAYWALL_JSON}
    }"

echo -e "\n${GREEN}✅ Metadata uploaded successfully!${NC}\n"

echo -e "${YELLOW}⚠️  Note:${NC}"
echo -e "  The metadata is now attached to your 'default' offering."
echo -e "  Your app can access this via the RevenueCat SDK:"
echo -e "  ${BLUE}offerings.current?.metadata${NC}\n"

echo -e "${YELLOW}📱 To use this in your app:${NC}"
echo -e "  1. Fetch offerings: await Purchases.getOfferings()"
echo -e "  2. Access metadata: offerings.current.metadata"
echo -e "  3. Build custom paywall UI using the JSON data\n"

echo -e "${GREEN}However...${NC}"
echo -e "  RevenueCat's built-in Paywall UI won't use this metadata."
echo -e "  You'll still need to configure the visual paywall in the dashboard.\n"
