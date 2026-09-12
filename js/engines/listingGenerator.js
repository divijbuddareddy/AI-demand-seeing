/**
 * Engine 5: Recommendation Engine & Localized Marketplace Listing Generator
 * Connects decision to Fridayy's execution layer:
 * Product -> Market Intelligence -> Decision -> Listing -> Sell -> Learn
 */

import { CONFIG } from '../config.js';

export class ListingGeneratorEngine {
  /**
   * Generates or adapts listing for a specific market platform
   */
  static generateListing({ productData, marketCode = 'UAE', platform = 'Amazon' }) {
    const market = CONFIG.MARKETS[marketCode] || CONFIG.MARKETS.UAE;
    const title = productData?.title || productData?.productUnderstanding?.detectedName || 'Handcrafted Artisan Product';
    const cat = productData?.productUnderstanding?.category || 'Home Décor & Living';
    const materials = (productData?.productUnderstanding?.materials || ['Natural Materials']).join(', ');

    const marketListings = productData?.localizedListings || {};

    // Specific local pricing
    const targetPriceLocal = productData?.markets?.find(m => m.code === marketCode)?.suggestedLocalPrice || 99;
    const targetPriceINR = productData?.markets?.find(m => m.code === marketCode)?.suggestedPriceINR || 2199;

    let listingTitle = marketListings.listingTitle;
    if (!listingTitle || marketListings.targetMarket?.indexOf(marketCode) === -1) {
      if (marketCode === 'UAE') {
        listingTitle = `${title} - Handcrafted Premium Decor | Authentic Artisan Collection for Home & Living | Luxury UAE Edition`;
      } else if (marketCode === 'USA') {
        listingTitle = `${title} - Bohemian Handcrafted Artisan Essential | Sustainable & Ethically Made Home Decor`;
      } else if (marketCode === 'UK') {
        listingTitle = `${title} - British Heritage Living | Eco-friendly Handcrafted Artisan Craft`;
      } else {
        listingTitle = `${title} - Premium Handcrafted Artisan Craftwork | Export Quality`;
      }
    }

    const defaultBullets = [
      `AUTHENTIC ARTISANAL CRAFTSMANSHIP: Handcrafted from high-grade ${materials}, preserving multi-generational artisan pottery and design techniques.`,
      `CAPTIVATING AMBIENT CHARM: Designed to diffuse a warm, tranquil ambiance that elevates living rooms, bedrooms, and contemporary interior spaces.`,
      `100% ECO-FRIENDLY & SUSTAINABLE: Zero plastic footprint with natural materials that promote conscious, sustainable luxury.`,
      `PERFECT CURATED GIFT: Makes a distinguished housewarming, festive, or luxury gift for connoisseurs of authentic handcrafted design.`,
      `REINFORCED EXPORT PACKAGING: Shipped in custom shock-absorbing protective casing for flawless, damage-free delivery.`
    ];

    const bullets = marketListings.bulletPoints && marketListings.bulletPoints.length >= 3
      ? marketListings.bulletPoints
      : defaultBullets;

    const defaultDescription = `Introduce world-class craftsmanship to your home with the ${title}. Meticulously designed for modern elegance, each unit reflects authentic heritage and superior artisan finishing. Built with ${materials}, this piece delivers enduring beauty, cultural authenticity, and captivating aesthetic value.`;

    const description = marketListings.description || defaultDescription;

    const searchKeywords = marketListings.searchKeywords || [
      'handmade artisan decor', 'boho home accent', 'luxury handmade gift',
      'ethical craft export', 'sustainable home living'
    ];

    return {
      marketCode,
      marketName: market.name,
      flag: market.flag,
      currency: market.currency,
      platformName: platform,
      listingTitle,
      priceLocalFormatted: `${market.symbol} ${targetPriceLocal.toLocaleString()}`,
      priceINRFormatted: `₹${targetPriceINR.toLocaleString()}`,
      bulletPoints: bullets,
      description,
      searchKeywords,
      categoryBreadcrumbs: `Home & Kitchen > Home Décor > ${cat}`,
      complianceTags: [
        `Customs HS Code: ${productData?.productUnderstanding?.hsCodeSuggestion || '6912.00.00'}`,
        `Origin: Made in India (Export Grade)`,
        `Transit Packaging: Shockproof Honeycomb / Custom Moulded EPE`,
        `Tax / Duties: Declared for ${market.code} Customs Clearance`
      ]
    };
  }
}
