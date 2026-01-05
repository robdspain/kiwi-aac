/**
 * RevenueCat Integration Test Script
 *
 * This script tests the RevenueCat integration to ensure everything is configured correctly.
 * Run this after completing the manual setup steps.
 *
 * Usage: node scripts/test-revenuecat.js
 */

const testColors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${testColors[color]}${message}${testColors.reset}`);
}

function logSection(title) {
  console.log('\n' + '='.repeat(60));
  log(title, 'cyan');
  console.log('='.repeat(60));
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green');
}

function logError(message) {
  log(`❌ ${message}`, 'red');
}

function logWarning(message) {
  log(`⚠️  ${message}`, 'yellow');
}

function logInfo(message) {
  log(`ℹ️  ${message}`, 'blue');
}

// Test configuration
const EXPECTED_CONFIG = {
  apiKey: process.env.VITE_REVENUECAT_API_KEY || 'YOUR_API_KEY_HERE',
  entitlement: 'pro',
  products: ['kiwi_monthly', 'kiwi_annual', 'kiwi_lifetime'],
  packages: ['$rc_monthly', '$rc_annual', '$rc_lifetime'],
  offeringId: 'default',
};

logSection('RevenueCat Integration Test');

log('\nThis script will verify your RevenueCat setup is correct.\n', 'bright');

// Test 1: Check environment variables
logSection('Test 1: Environment Variables');

if (process.env.VITE_REVENUECAT_API_KEY) {
  logSuccess(`API Key configured: ${process.env.VITE_REVENUECAT_API_KEY.substring(0, 15)}...`);
} else {
  logError('VITE_REVENUECAT_API_KEY not found in environment variables!');
  logInfo('Create a .env file with: VITE_REVENUECAT_API_KEY=your_key_here');
}

// Test 2: Check file structure
logSection('Test 2: File Structure');

const fs = require('fs');
const path = require('path');

const requiredFiles = [
  'src/plugins/revenuecat.ts',
  'src/services/RevenueCatService.js',
  'src/utils/paywall.js',
  'revenuecat-paywall-config.json',
  'PAYWALL-SETUP-README.md',
  '.env.example',
];

requiredFiles.forEach(file => {
  const fullPath = path.join(process.cwd(), file);
  if (fs.existsSync(fullPath)) {
    logSuccess(`Found: ${file}`);
  } else {
    logError(`Missing: ${file}`);
  }
});

// Test 3: Check package.json dependencies
logSection('Test 3: Dependencies');

try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };

  const requiredDeps = [
    '@revenuecat/purchases-capacitor',
    '@revenuecat/purchases-capacitor-ui',
  ];

  requiredDeps.forEach(dep => {
    if (deps[dep]) {
      logSuccess(`${dep} v${deps[dep]}`);
    } else {
      logError(`${dep} not installed!`);
      logInfo(`Run: npm install ${dep}`);
    }
  });
} catch (error) {
  logError('Could not read package.json');
}

// Test 4: Validate paywall configuration
logSection('Test 4: Paywall Configuration');

try {
  const configPath = path.join(process.cwd(), 'revenuecat-paywall-config.json');
  const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

  // Check offering
  if (config.offering_config.identifier === 'default') {
    logSuccess('Offering ID is "default" ✓');
  } else {
    logWarning(`Offering ID is "${config.offering_config.identifier}" (expected "default")`);
  }

  // Check entitlement
  if (config.entitlement_config.identifier === 'pro') {
    logSuccess('Entitlement ID is "pro" ✓');
  } else {
    logError(`Entitlement ID is "${config.entitlement_config.identifier}" (must be "pro")`);
  }

  // Check products
  const products = config.entitlement_config.products;
  if (products.includes('kiwi_monthly') && products.includes('kiwi_annual') && products.includes('kiwi_lifetime')) {
    logSuccess('Products configured: kiwi_monthly, kiwi_annual, kiwi_lifetime ✓');
  } else {
    logError(`Products found: ${products.join(', ')}`);
    logInfo('Expected: kiwi_monthly, kiwi_annual, kiwi_lifetime');
  }

  // Check packages
  const packages = config.offering_config.packages.map(p => p.identifier);
  if (packages.includes('$rc_monthly') && packages.includes('$rc_annual') && packages.includes('$rc_lifetime')) {
    logSuccess('Packages configured: $rc_monthly, $rc_annual, $rc_lifetime ✓');
  } else {
    logWarning(`Packages found: ${packages.join(', ')}`);
  }

  // Check paywall features
  const features = config.paywall_config.localization.en_US.features;
  if (features.length === 8) {
    logSuccess(`Paywall has 8 features configured ✓`);
    features.forEach((f, i) => {
      log(`  ${i + 1}. ${f.title}`, 'blue');
    });
  } else {
    logWarning(`Paywall has ${features.length} features (expected 8)`);
  }

} catch (error) {
  logError(`Could not validate config: ${error.message}`);
}

// Test 5: Check service configuration
logSection('Test 5: Service Configuration');

try {
  const servicePath = path.join(process.cwd(), 'src/services/RevenueCatService.js');
  const serviceCode = fs.readFileSync(servicePath, 'utf8');

  // Check for entitlement
  if (serviceCode.includes("PRO: 'pro'")) {
    logSuccess('Service configured with "pro" entitlement ✓');
  } else {
    logError('Service entitlement configuration not found');
  }

  // Check for product IDs
  if (serviceCode.includes('MONTHLY') && serviceCode.includes('YEARLY')) {
    logSuccess('Product ID constants defined ✓');
  }

  // Check for free tier limits
  if (serviceCode.includes('FREE_TIER_LIMITS')) {
    logSuccess('Free tier limits configured ✓');
  }

} catch (error) {
  logError(`Could not read service file: ${error.message}`);
}

// Test 6: Check integration points
logSection('Test 6: Integration Points');

try {
  // Check App.jsx initialization
  const appPath = path.join(process.cwd(), 'src/App.jsx');
  const appCode = fs.readFileSync(appPath, 'utf8');

  if (appCode.includes('configureRevenueCat')) {
    logSuccess('RevenueCat initialization in App.jsx ✓');
  } else {
    logWarning('RevenueCat initialization not found in App.jsx');
  }

  // Check Controls.jsx customer center
  const controlsPath = path.join(process.cwd(), 'src/components/Controls.jsx');
  const controlsCode = fs.readFileSync(controlsPath, 'utf8');

  if (controlsCode.includes('handleCustomerCenter')) {
    logSuccess('Customer Center button in Controls.jsx ✓');
  } else {
    logWarning('Customer Center button not found in Controls.jsx');
  }

  if (controlsCode.includes('Manage Subscription')) {
    logSuccess('Customer Center UI added ✓');
  }

} catch (error) {
  logError(`Could not check integration points: ${error.message}`);
}

// Summary
logSection('Test Summary');

log('\n📋 Next Steps:\n', 'bright');
log('1. Complete manual setup steps in PAYWALL-SETUP-README.md', 'cyan');
log('2. Create products in App Store Connect and Google Play Console', 'cyan');
log('3. Configure RevenueCat Dashboard (products, entitlement, offering)', 'cyan');
log('4. Design paywall using revenuecat-paywall-config.json', 'cyan');
log('5. Test on iOS/Android devices', 'cyan');
log('6. Replace test API key with production key', 'cyan');
log('7. Deploy and monetize! 🚀', 'green');

log('\n📚 Documentation:', 'bright');
log('- PAYWALL-SETUP-README.md - Complete setup guide', 'blue');
log('- revenuecat-paywall-config.json - Paywall configuration\n', 'blue');

logSection('Test Complete');
