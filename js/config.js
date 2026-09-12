/**
 * Fridayy AI Global Growth Copilot - Configuration & Presets
 */

export const CONFIG = {
  APP_NAME: 'Fridayy AI Global Growth Copilot',
  APP_VERSION: '1.0.0',
  DEFAULT_GEMINI_MODEL: 'gemini-3.6-flash',
  STORAGE_KEY_API: 'fridayy_gemini_api_key',
  STORAGE_KEY_HISTORY: 'fridayy_analysis_history',
  
  // Supported Target Global Markets
  MARKETS: {
    UAE: {
      code: 'UAE',
      name: 'United Arab Emirates',
      flag: '🇦🇪',
      currency: 'AED',
      symbol: 'AED',
      exchangeRateToINR: 0.044, // 1 INR ~ 0.044 AED
      exchangeRateToUSD: 0.272,
      primaryPlatforms: ['Amazon.ae', 'Noon', 'Namshi'],
      baseDemandIndex: 94,
      avgCustomDutyRate: 0.05, // 5%
      vatRate: 0.05, // 5%
      avgShippingPerKgINR: 450,
      leadTimeDays: '3-5 days',
      marketMaturity: 'High Growth / High Affluence',
      culturalFitTags: ['Artisanal Crafts', 'Luxury Home Décor', 'Festive Items', 'Organic Wellness']
    },
    USA: {
      code: 'USA',
      name: 'United States',
      flag: '🇺🇸',
      currency: 'USD',
      symbol: '$',
      exchangeRateToINR: 0.012, // 1 INR ~ 0.012 USD
      exchangeRateToUSD: 1.0,
      primaryPlatforms: ['Amazon.com', 'Etsy', 'Shopify US', 'Walmart'],
      baseDemandIndex: 88,
      avgCustomDutyRate: 0.065, // ~6.5%
      vatRate: 0.08, // average sales tax
      avgShippingPerKgINR: 950,
      leadTimeDays: '6-9 days',
      marketMaturity: 'Massive Volume / High Competition',
      culturalFitTags: ['Boho Home Décor', 'Handmade & Vintage', 'Sustainable Goods', 'Ethical Fashion']
    },
    UK: {
      code: 'UK',
      name: 'United Kingdom',
      flag: '🇬🇧',
      currency: 'GBP',
      symbol: '£',
      exchangeRateToINR: 0.0094, // 1 INR ~ 0.0094 GBP
      exchangeRateToUSD: 1.28,
      primaryPlatforms: ['Amazon.co.uk', 'Etsy UK', 'NotOnTheHighStreet'],
      baseDemandIndex: 82,
      avgCustomDutyRate: 0.08,
      vatRate: 0.20, // 20% VAT
      avgShippingPerKgINR: 850,
      leadTimeDays: '5-8 days',
      marketMaturity: 'Stable / High Artisan Appreciation',
      culturalFitTags: ['Eco-friendly', 'Handcrafted Ceramics', 'Heritage Textiles', 'Fair Trade']
    },
    GERMANY: {
      code: 'GERMANY',
      name: 'Germany (EU)',
      flag: '🇩🇪',
      currency: 'EUR',
      symbol: '€',
      exchangeRateToINR: 0.011,
      exchangeRateToUSD: 1.09,
      primaryPlatforms: ['Amazon.de', 'Otto', 'Etsy EU'],
      baseDemandIndex: 79,
      avgCustomDutyRate: 0.065,
      vatRate: 0.19,
      avgShippingPerKgINR: 900,
      leadTimeDays: '6-9 days',
      marketMaturity: 'Eco-conscious / High Quality Standards',
      culturalFitTags: ['Natural Clay', 'Minimalist Craft', 'Zero-Plastic', 'Certified Organic']
    },
    AUSTRALIA: {
      code: 'AUSTRALIA',
      name: 'Australia',
      flag: '🇦🇺',
      currency: 'AUD',
      symbol: 'A$',
      exchangeRateToINR: 0.018,
      exchangeRateToUSD: 0.66,
      primaryPlatforms: ['Amazon.com.au', 'Etsy AU', 'Catch'],
      baseDemandIndex: 76,
      avgCustomDutyRate: 0.05,
      vatRate: 0.10, // GST
      avgShippingPerKgINR: 1100,
      leadTimeDays: '7-12 days',
      marketMaturity: 'Premium Niche / High Purchasing Power',
      culturalFitTags: ['Terracotta Gardenware', 'Natural Textiles', 'Artisan Coffee/Tea Ware']
    },
    SINGAPORE: {
      code: 'SINGAPORE',
      name: 'Singapore',
      flag: '🇸🇬',
      currency: 'SGD',
      symbol: 'S$',
      exchangeRateToINR: 0.016,
      exchangeRateToUSD: 0.75,
      primaryPlatforms: ['Lazada SG', 'Shopee SG', 'Amazon.sg'],
      baseDemandIndex: 84,
      avgCustomDutyRate: 0.00,
      vatRate: 0.09, // 9% GST
      avgShippingPerKgINR: 550,
      leadTimeDays: '3-6 days',
      marketMaturity: 'High Density / Fast Shipping Hub',
      culturalFitTags: ['Asian Heritage Crafts', 'Compact Home Décor', 'Gourmet Herbs & Teas']
    }
  },

  // Ready-to-use Sample Product Presets with Real High-Res Photography Assets
  PRESETS: [
    {
      id: 'preset-lamp',
      title: 'Handmade Terracotta Lamp',
      category: 'Home & Living / Handcrafted Lighting',
      costPriceINR: 700,
      domesticPriceINR: 1200,
      weightKg: 1.2,
      quantity: 100,
      description: 'Handcrafted organic terracotta clay table lamp with perforated floral jaali cutouts and warm ambient luxury glow.',
      image: 'assets/sample_terracotta_lamp.jpg',
      tag: 'Handmade Clay'
    },
    {
      id: 'preset-saffron',
      title: 'Organic Kashmiri Mongra Saffron (5g)',
      category: 'Gourmet Foods & Spices / Organic Wellness',
      costPriceINR: 1100,
      domesticPriceINR: 1950,
      weightKg: 0.08,
      quantity: 250,
      description: 'Grade A1 pure Kashmiri mongra saffron stigmas in luxury glass airtight jar with brushed gold brass cap.',
      image: 'assets/sample_kashmiri_saffron.jpg',
      tag: 'Luxury Spice'
    },
    {
      id: 'preset-bag',
      title: 'Full-Grain Leather Messenger Bag',
      category: 'Bags & Accessories / Handcrafted Leather',
      costPriceINR: 2200,
      domesticPriceINR: 4400,
      weightKg: 1.6,
      quantity: 50,
      description: 'Handcrafted vegetable-tanned full-grain leather messenger satchel with antique brass buckles and padded laptop compartment.',
      image: 'assets/sample_leather_bag.jpg',
      tag: 'Artisan Leather'
    },
    {
      id: 'preset-diffuser',
      title: 'Hand-Hammered Brass Aroma Diffuser',
      category: 'Home & Wellness / Handcrafted Metalware',
      costPriceINR: 950,
      domesticPriceINR: 1800,
      weightKg: 0.9,
      quantity: 120,
      description: 'Solid hammered antique brass aromatherapy essential oil diffuser with flickering candle chamber and detachable cup.',
      image: 'assets/sample_brass_diffuser.jpg',
      tag: 'Hammered Brass'
    }
  ]
};
