/**
 * RevenueCat Paywall Creator
 *
 * This script uses the RevenueCat REST API to programmatically create
 * the "First Kiwi Paywall" with all configured content and design.
 *
 * Usage:
 *   node scripts/create-paywall.js
 *
 * Requirements:
 *   - REVENUECAT_API_KEY environment variable (get from RevenueCat dashboard)
 *   - REVENUECAT_PROJECT_ID environment variable
 */

const REVENUECAT_API_KEY = process.env.REVENUECAT_API_KEY || 'YOUR_SECRET_API_KEY_HERE';
const REVENUECAT_PROJECT_ID = process.env.REVENUECAT_PROJECT_ID || 'YOUR_PROJECT_ID';
const API_BASE_URL = 'https://api.revenuecat.com/v2';

/**
 * Complete Kiwi AAC Paywall Configuration
 */
const KIWI_PAYWALL_CONFIG = {
  identifier: 'first_kiwi_paywall',
  name: 'First Kiwi Paywall',
  default: true,
  config: {
    type: 'full_screen',
    template: 'template_5', // Full-screen template with features list

    // Header Section
    header: {
      icon_url: null, // Will use emoji fallback
      icon_emoji: '🥝',
      icon_size: 80,
      title: {
        text: 'Unlock Kiwi Pro',
        color: '#2D3436',
        font_size: 28,
        font_weight: 'bold',
      },
      subtitle: {
        text: 'Empower unlimited communication with premium AAC features',
        color: '#6C757D',
        font_size: 17,
        font_weight: 'regular',
      },
      background: {
        type: 'gradient',
        colors: ['#FFFFFF', '#F8F9FA'],
        direction: 'vertical',
      },
    },

    // Features Section
    features: {
      title: "What's Included",
      items: [
        {
          icon: '✨',
          title: 'Unlimited Vocabulary',
          description: 'Break free from the 50-word limit. Add unlimited custom buttons and folders.',
          highlighted: true,
        },
        {
          icon: '🎙️',
          title: 'Premium Voice Quality',
          description: 'Access enhanced, natural-sounding voices for clearer communication.',
          highlighted: true,
        },
        {
          icon: '👥',
          title: 'Multiple User Profiles',
          description: 'Perfect for families, schools, and clinics. Unlimited profiles with personalized settings.',
          highlighted: false,
        },
        {
          icon: '☁️',
          title: 'Cloud Backup & Sync',
          description: 'Never lose your vocabulary. Automatic backup and sync across all devices.',
          highlighted: false,
        },
        {
          icon: '📊',
          title: 'Advanced Analytics',
          description: 'Track communication progress with detailed insights and usage reports.',
          highlighted: false,
        },
        {
          icon: '🎨',
          title: 'Premium Themes',
          description: 'Personalize your experience with Ocean, Sunset, Forest, Berry, and Candy themes.',
          highlighted: false,
        },
        {
          icon: '📸',
          title: 'Unlimited Photos',
          description: 'Add unlimited custom photos from your camera roll or family albums.',
          highlighted: false,
        },
        {
          icon: '🧑‍💼',
          title: 'Custom Characters',
          description: 'Create unlimited personalized avatars for your Circle of Support.',
          highlighted: false,
        },
        {
          icon: '🔔',
          title: 'Priority Support',
          description: 'Get fast, dedicated help from our AAC specialists whenever you need it.',
          highlighted: false,
        },
      ],
    },

    // Social Proof
    social_proof: {
      enabled: true,
      rating: {
        stars: 5,
        value: 4.9,
        text: '⭐⭐⭐⭐⭐ 4.9 out of 5 stars',
      },
      users: {
        count: 10000,
        text: 'Join 10,000+ AAC users worldwide',
      },
    },

    // Pricing Section
    pricing: {
      header: 'Choose Your Plan',
      packages: [
        {
          package_identifier: '$rc_monthly',
          title: 'Monthly',
          badge: {
            text: 'Most Flexible',
            color: '#007AFF',
          },
          features: [
            'All premium features',
            'Monthly billing',
            'Cancel anytime',
          ],
          default: false,
          highlighted: false,
        },
        {
          package_identifier: '$rc_annual',
          title: 'Annual',
          badge: {
            text: 'Best Value 🏆',
            color: '#22C55E',
          },
          price_per_month_text: '$6.67/month',
          savings_text: 'Save 33%',
          savings_amount_text: 'Save $40/year',
          features: [
            'All premium features',
            'Save $40 per year',
            'Best value',
          ],
          default: true,
          highlighted: true,
        },
      ],
    },

    // Free Trial
    free_trial: {
      enabled: true,
      duration_days: 7,
      cta_text: 'Start 7-Day Free Trial',
      disclaimer: 'Free for 7 days, then {{price}} per {{period}}. Cancel anytime.',
    },

    // Call to Action Buttons
    cta: {
      primary: {
        text: 'Start Free Trial',
        background_color: '#1A535C',
        text_color: '#FFFFFF',
        border_radius: 12,
        height: 56,
        shadow: true,
      },
      secondary: {
        text: 'Restore Purchases',
        background_color: 'transparent',
        text_color: '#007AFF',
        border_color: '#007AFF',
        border_width: 2,
        border_radius: 12,
        height: 44,
      },
    },

    // Footer
    footer: {
      legal_links: [
        {
          text: 'Terms of Service',
          url: 'https://kiwivoiceapp.com/terms',
        },
        {
          text: 'Privacy Policy',
          url: 'https://kiwivoiceapp.com/privacy',
        },
        {
          text: 'Support',
          url: 'mailto:support@kiwivoiceapp.com',
        },
      ],
      disclaimer: 'Subscription automatically renews unless cancelled at least 24 hours before the end of the current period. Manage subscriptions in Settings.',
      text_color: '#6C757D',
      font_size: 12,
    },

    // Design System
    design: {
      colors: {
        primary: '#1A535C',
        accent: '#007AFF',
        success: '#22C55E',
        background: '#FFFFFF',
        card_background: '#F8F9FA',
        text_primary: '#2D3436',
        text_secondary: '#6C757D',
        border: '#E5E5EA',
      },
      typography: {
        font_family: 'SF Pro',
        title_size: 28,
        subtitle_size: 17,
        body_size: 15,
        caption_size: 13,
        small_size: 12,
      },
      spacing: {
        padding: 24,
        section_spacing: 32,
        item_spacing: 16,
      },
      corner_radius: 16,
      shadow_enabled: true,
    },
  },

  // Localization
  localizations: {
    es: {
      header: {
        title: 'Desbloquea Kiwi Pro',
        subtitle: 'Potencia la comunicación ilimitada con funciones AAC premium',
      },
      features: {
        items: [
          {
            title: 'Vocabulario Ilimitado',
            description: 'Libérate del límite de 50 palabras. Agrega botones y carpetas personalizados ilimitados.',
          },
          {
            title: 'Calidad de Voz Premium',
            description: 'Accede a voces mejoradas y naturales para una comunicación más clara.',
          },
          {
            title: 'Múltiples Perfiles de Usuario',
            description: 'Perfecto para familias, escuelas y clínicas. Perfiles ilimitados con configuraciones personalizadas.',
          },
          {
            title: 'Copia de Seguridad en la Nube',
            description: 'Nunca pierdas tu vocabulario. Copia de seguridad automática y sincronización en todos los dispositivos.',
          },
          {
            title: 'Análisis Avanzados',
            description: 'Sigue el progreso de comunicación con informes detallados y de uso.',
          },
          {
            title: 'Temas Premium',
            description: 'Personaliza tu experiencia con temas Océano, Atardecer, Bosque, Mora y Dulce.',
          },
          {
            title: 'Fotos Ilimitadas',
            description: 'Agrega fotos personalizadas ilimitadas desde tu rollo de cámara o álbumes familiares.',
          },
          {
            title: 'Personajes Personalizados',
            description: 'Crea avatares personalizados ilimitados para tu Círculo de Apoyo.',
          },
          {
            title: 'Soporte Prioritario',
            description: 'Obtén ayuda rápida y dedicada de nuestros especialistas en AAC cuando la necesites.',
          },
        ],
      },
      pricing: {
        header: 'Elige Tu Plan',
      },
      cta: {
        primary: {
          text: 'Comenzar Prueba Gratis',
        },
        secondary: {
          text: 'Restaurar Compras',
        },
      },
    },
  },
};

/**
 * Create paywall via RevenueCat REST API
 */
async function createPaywall() {
  console.log('🚀 Creating First Kiwi Paywall via RevenueCat API...\n');

  try {
    const response = await fetch(`${API_BASE_URL}/projects/${REVENUECAT_PROJECT_ID}/paywalls`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${REVENUECAT_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(KIWI_PAYWALL_CONFIG),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`API Error: ${response.status} - ${JSON.stringify(error)}`);
    }

    const result = await response.json();

    console.log('✅ Paywall created successfully!\n');
    console.log('Paywall Details:');
    console.log('  - ID:', result.id);
    console.log('  - Identifier:', result.identifier);
    console.log('  - Name:', result.name);
    console.log('  - Default:', result.default);
    console.log('\n📱 Your paywall is now live and ready to use!');

    return result;
  } catch (error) {
    console.error('❌ Failed to create paywall:', error.message);
    console.error('\nTroubleshooting:');
    console.error('  1. Verify REVENUECAT_API_KEY is set correctly');
    console.error('  2. Verify REVENUECAT_PROJECT_ID is correct');
    console.error('  3. Check that your API key has "Paywalls" write permissions');
    console.error('  4. Ensure you have the RevenueCat Paywalls feature enabled');

    throw error;
  }
}

/**
 * Update existing paywall
 */
async function updatePaywall(paywallId) {
  console.log(`🔄 Updating paywall ${paywallId}...\n`);

  try {
    const response = await fetch(`${API_BASE_URL}/projects/${REVENUECAT_PROJECT_ID}/paywalls/${paywallId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${REVENUECAT_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(KIWI_PAYWALL_CONFIG),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`API Error: ${response.status} - ${JSON.stringify(error)}`);
    }

    const result = await response.json();

    console.log('✅ Paywall updated successfully!\n');

    return result;
  } catch (error) {
    console.error('❌ Failed to update paywall:', error.message);
    throw error;
  }
}

/**
 * List all paywalls
 */
async function listPaywalls() {
  console.log('📋 Fetching all paywalls...\n');

  try {
    const response = await fetch(`${API_BASE_URL}/projects/${REVENUECAT_PROJECT_ID}/paywalls`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${REVENUECAT_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`API Error: ${response.status} - ${JSON.stringify(error)}`);
    }

    const result = await response.json();

    console.log(`Found ${result.paywalls.length} paywall(s):\n`);
    result.paywalls.forEach((paywall, index) => {
      console.log(`${index + 1}. ${paywall.name} (${paywall.identifier})`);
      console.log(`   - ID: ${paywall.id}`);
      console.log(`   - Default: ${paywall.default}`);
      console.log('');
    });

    return result.paywalls;
  } catch (error) {
    console.error('❌ Failed to list paywalls:', error.message);
    throw error;
  }
}

// Main execution
if (import.meta.url === `file://${process.argv[1]}`) {
  const command = process.argv[2] || 'create';

  (async () => {
    try {
      switch (command) {
        case 'create':
          await createPaywall();
          break;
        case 'update':
          const paywallId = process.argv[3];
          if (!paywallId) {
            console.error('❌ Please provide paywall ID: node create-paywall.js update <paywall-id>');
            process.exit(1);
          }
          await updatePaywall(paywallId);
          break;
        case 'list':
          await listPaywalls();
          break;
        default:
          console.error('❌ Unknown command. Use: create, update, or list');
          process.exit(1);
      }
    } catch (error) {
      process.exit(1);
    }
  })();
}

export { createPaywall, updatePaywall, listPaywalls, KIWI_PAYWALL_CONFIG };
