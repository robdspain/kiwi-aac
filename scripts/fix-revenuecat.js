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

const SECRET_KEY = process.env.REVENUECAT_SECRET_KEY;
const PROJECT_ID = process.env.REVENUECAT_PROJECT_ID;
const BASE_URL_V2 = 'https://api.revenuecat.com/v2';

async function log(msg, type = 'info') {
  const colors = {
    info: '\x1b[36m', // Cyan
    success: '\x1b[32m', // Green
    error: '\x1b[31m', // Red
    reset: '\x1b[0m'
  };
  console.log(`${colors[type] || colors.info}${msg}${colors.reset}`);
}

async function request(endpoint, method = 'GET', body = null, options = {}) {
  try {
    const url = `${BASE_URL_V2}/projects/${PROJECT_ID}${endpoint}`;
    console.log(`\n📡 ${method} ${endpoint}`);
    
    const options = {
      method,
      headers: {
        'Authorization': `Bearer ${SECRET_KEY}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    };

    if (body) options.body = JSON.stringify(body);

    const response = await fetch(url, options);
    const text = await response.text();
    
    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      data = { raw: text };
    }

    if (!response.ok) {
      if (options.allowStatus?.includes(response.status)) {
        console.log(`   ⚠️  Status: ${response.status} (allowed)`);
        return { ok: true, status: response.status, data, allowed: true };
      }
      console.log(`   ❌ Status: ${response.status}`);
      console.log(`   ❌ Response:`, JSON.stringify(data, null, 2));
      return { ok: false, status: response.status, data };
    }

    console.log(`   ✅ Success`);
    return { ok: true, data };
  } catch (error) {
    console.error(`   ❌ Network Error:`, error.message);
    return { ok: false, error };
  }
}

async function getAppId() {
  if (process.env.REVENUECAT_APP_ID) return process.env.REVENUECAT_APP_ID;
  const apps = await request('/apps');
  if (!apps.ok) return null;
  const items = apps.data?.items || [];
  const kiwiApp = items.find(app => (app.name || '').toLowerCase().includes('kiwi voice'));
  return (kiwiApp || items[0])?.id || null;
}

async function main() {
  log('🥝 Kiwi AAC - RevenueCat Diagnostics', 'info');
  log(`Project ID: ${PROJECT_ID}`, 'info');

  const appId = await getAppId();
  if (!appId) {
    log('❌ Could not resolve RevenueCat app ID. Set REVENUECAT_APP_ID in .env.', 'error');
    return;
  }
  log(`App ID: ${appId}`, 'info');

  // 1. Check Products
  log('\nChecking Products...', 'info');
  const products = await request('/products');
  const productItems = products.ok ? (products.data?.items || []) : [];
  const appProducts = productItems.filter(item => item.app_id === appId);

  const ensureProduct = async (storeIdentifier, displayName, type) => {
    const exists = appProducts.some(item => item.store_identifier === storeIdentifier);
    if (exists) {
      log(`✅ Product exists: ${storeIdentifier}`, 'success');
      return;
    }
    const result = await request('/products', 'POST', {
      app_id: appId,
      store_identifier: storeIdentifier,
      display_name: displayName,
      type
    }, { allowStatus: [409] });
    if (result.ok && result.data) appProducts.push(result.data);
  };

  await ensureProduct('kiwi_monthly', 'Monthly', 'subscription');
  await ensureProduct('kiwi_annual', 'Annual', 'subscription');
  await ensureProduct('kiwi_lifetime', 'Lifetime', 'one_time');

  // 2. Check Entitlements
  log('\nChecking Entitlements...', 'info');
  const entitlements = await request('/entitlements');
  const entitlementItems = entitlements.ok ? (entitlements.data?.items || []) : [];
  const proEntitlement = entitlementItems.find(item => item.lookup_key === 'pro');
  if (!proEntitlement) {
    await request('/entitlements', 'POST', {
      lookup_key: 'pro',
      display_name: 'Pro'
    }, { allowStatus: [409] });
  } else {
    log('✅ Entitlement exists: pro', 'success');
  }

  log('\nNote: RevenueCat v2 does not allow programmatic entitlement-product linking. Attach products to the "pro" entitlement in the dashboard.', 'error');

  // 3. Check Offering
  log('\nCreating/Checking Default Offering...', 'info');
  const offerings = await request('/offerings');
  const offeringItems = offerings.ok ? (offerings.data?.items || []) : [];
  let defaultOffering = offeringItems.find(item => item.lookup_key === 'default');
  if (!defaultOffering) {
    const created = await request('/offerings', 'POST', {
      lookup_key: 'default',
      display_name: 'Default Offering'
    }, { allowStatus: [409] });
    if (created.ok && created.data) {
      defaultOffering = created.data;
    } else if (!defaultOffering) {
      const refreshed = await request('/offerings');
      const refreshedItems = refreshed.ok ? (refreshed.data?.items || []) : [];
      defaultOffering = refreshedItems.find(item => item.lookup_key === 'default');
    }
  } else {
    log('✅ Offering exists: default', 'success');
  }

  // 4. Add Packages
  log('\nAdding Packages to Offering...', 'info');
  if (!defaultOffering?.id) {
    log('❌ Could not resolve offering ID for "default". Skipping package setup.', 'error');
  } else {
    const packages = await request(`/offerings/${defaultOffering.id}/packages`);
    const packageItems = packages.ok ? (packages.data?.items || []) : [];
    const ensurePackage = async (lookupKey, displayName, position) => {
      const exists = packageItems.some(item => item.lookup_key === lookupKey);
      if (exists) {
        log(`✅ Package exists: ${lookupKey}`, 'success');
        return;
      }
      await request(`/offerings/${defaultOffering.id}/packages`, 'POST', {
        lookup_key: lookupKey,
        display_name: displayName,
        position
      }, { allowStatus: [409] });
    };

    await ensurePackage('$rc_monthly', 'Monthly', 1);
    await ensurePackage('$rc_annual', 'Annual', 0);
    await ensurePackage('$rc_lifetime', 'Lifetime', 2);
  }

  log('\nReminder: Link packages to products and attach products to the "pro" entitlement in the RevenueCat dashboard.', 'error');

  log('\n✨ Diagnostics Complete', 'success');
}

main();
