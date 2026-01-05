import fs from 'fs';
import path from 'path';

// Load .env
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

const API_KEY = process.env.REVENUECAT_SECRET_KEY;
const PROJECT_ID = process.env.REVENUECAT_PROJECT_ID;
const API_BASE = 'https://api.revenuecat.com/v2';
const URL = `${API_BASE}/projects/${PROJECT_ID}/paywalls`;
const CREATE_PAYWALL = process.env.CREATE_PAYWALL === '1';
const OFFERING_LOOKUP_KEY = process.env.REVENUECAT_OFFERING_LOOKUP_KEY || 'default';

const safeJsonParse = (text) => {
  try {
    return { data: JSON.parse(text), error: null };
  } catch (error) {
    return { data: null, error };
  }
};

async function getOfferingId() {
  const response = await fetch(`${API_BASE}/projects/${PROJECT_ID}/offerings`, {
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Accept': 'application/json'
    }
  });

  const text = await response.text();
  const { data, error } = safeJsonParse(text);

  if (!response.ok) {
    const message = data?.message ? `: ${data.message}` : '';
    throw new Error(`Failed to fetch offerings (${response.status})${message}`);
  }

  if (error || !data) {
    throw new Error(`Offerings response is not valid JSON: ${text.slice(0, 200)}`);
  }

  const item = (data.items || []).find(entry => entry.lookup_key === OFFERING_LOOKUP_KEY);
  return item?.id || null;
}

async function testSchema() {
  console.log('🔍 Probing Paywall API Schema...\n');

  if (!API_KEY || !PROJECT_ID) {
    console.error('Missing RevenueCat credentials. Set REVENUECAT_SECRET_KEY and REVENUECAT_PROJECT_ID.');
    return;
  }

  let offeringId = null;
  try {
    offeringId = await getOfferingId();
  } catch (error) {
    console.error(`Failed to resolve offering ID (${OFFERING_LOOKUP_KEY}):`, error.message);
    return;
  }

  if (!offeringId) {
    console.error(`No offering found for lookup key "${OFFERING_LOOKUP_KEY}". Create it first in RevenueCat.`);
    return;
  }

  console.log(`Using offering "${OFFERING_LOOKUP_KEY}" (${offeringId})`);
  console.log('Test 1: Missing required offering_id (expected error)');
  await sendRequest({});
  
  console.log('\nTest 2: Extra fields are rejected (expected error)');
  await sendRequest({
    offering_id: offeringId,
    template: 'template_1',
    type: 'full_screen'
  });

  if (CREATE_PAYWALL) {
    console.log('\nTest 3: offering_id only (creates paywall stub)');
    await sendRequest({ offering_id: offeringId });
  } else {
    console.log('\nTest 3: Skipped creation. Set CREATE_PAYWALL=1 to create a paywall stub.');
  }
}

async function sendRequest(payload) {
  try {
    const response = await fetch(URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const text = await response.text();
    const { data } = safeJsonParse(text);
    
    if (response.ok) {
      console.log('✅ Success!', data || text);
    } else {
      if (data) {
        console.log('❌ Error:', JSON.stringify(data, null, 2));
      } else {
        console.log('❌ Error:', text);
      }
    }
  } catch (e) {
    console.error('Network Error:', e);
  }
}

testSchema();
