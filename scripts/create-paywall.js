/**
 * RevenueCat Paywall Helper
 *
 * RevenueCat v2 only allows creating a paywall stub with `offering_id`.
 * Paywall design (template, features, pricing layout) must be configured
 * in the RevenueCat dashboard.
 *
 * Optional actions:
 *   CREATE_PAYWALL=1 node scripts/create-paywall.js
 *   UPLOAD_METADATA=1 node scripts/create-paywall.js
 */

import fs from 'fs';
import path from 'path';

// Load .env file manually
const envPath = path.resolve(process.cwd(), '.env');
if (fs.existsSync(envPath)) {
  const envConfig = fs.readFileSync(envPath, 'utf8');
  envConfig.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) {
      process.env[key.trim()] = value.trim().replace(/^["']|["']$/g, '');
    }
  });
}

const SECRET_KEY = process.env.REVENUECAT_SECRET_KEY || process.env.REVENUECAT_API_KEY;
const PROJECT_ID = process.env.REVENUECAT_PROJECT_ID;
const API_BASE_URL = 'https://api.revenuecat.com/v2';
const METADATA_PATH = path.resolve(process.cwd(), 'paywall-dashboard-config.json');
const CREATE_PAYWALL = process.env.CREATE_PAYWALL === '1';
const UPLOAD_METADATA = process.env.UPLOAD_METADATA === '1';

const log = (message) => console.log(message);

const request = async (endpoint, method = 'GET', body = null) => {
  const url = `${API_BASE_URL}/projects/${PROJECT_ID}${endpoint}`;
  const response = await fetch(url, {
    method,
    headers: {
      'Authorization': `Bearer ${SECRET_KEY}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: body ? JSON.stringify(body) : null
  });

  const text = await response.text();
  let data = null;
  try {
    data = JSON.parse(text);
  } catch {
    data = { raw: text };
  }

  if (!response.ok) {
    const message = data?.message || response.statusText;
    throw new Error(`${method} ${endpoint} failed: ${message}`);
  }

  return data;
};

const getDefaultOffering = async () => {
  const data = await request('/offerings');
  const items = data?.items || [];
  return items.find(item => item.lookup_key === 'default') || null;
};

const createPaywallStub = async (offeringId) => {
  return await request('/paywalls', 'POST', { offering_id: offeringId });
};

const uploadMetadata = async (offeringId) => {
  if (!fs.existsSync(METADATA_PATH)) {
    throw new Error(`Missing ${METADATA_PATH}`);
  }
  const metadata = JSON.parse(fs.readFileSync(METADATA_PATH, 'utf8'));
  return await request(`/offerings/${offeringId}`, 'PATCH', { metadata });
};

const main = async () => {
  if (!SECRET_KEY || !PROJECT_ID) {
    log('❌ Missing RevenueCat credentials. Set REVENUECAT_SECRET_KEY and REVENUECAT_PROJECT_ID.');
    process.exit(1);
  }

  log('🥝 RevenueCat Paywall Helper');
  const offering = await getDefaultOffering();
  if (!offering) {
    log('❌ Default offering not found. Create it in RevenueCat first.');
    process.exit(1);
  }

  if (CREATE_PAYWALL) {
    const paywall = await createPaywallStub(offering.id);
    log(`✅ Paywall stub created: ${paywall?.id || 'unknown id'}`);
  } else {
    log('ℹ️  Skipping paywall creation. Set CREATE_PAYWALL=1 to create a stub.');
  }

  if (UPLOAD_METADATA) {
    await uploadMetadata(offering.id);
    log('✅ Offering metadata updated from paywall-dashboard-config.json');
  } else {
    log('ℹ️  Skipping metadata upload. Set UPLOAD_METADATA=1 to attach metadata.');
  }

  log('Note: Configure the visual paywall in the RevenueCat dashboard (Paywalls UI).');
};

main().catch(error => {
  console.error('❌ Error:', error.message);
  process.exit(1);
});
