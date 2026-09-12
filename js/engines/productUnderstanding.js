/**
 * Engine 1: Product Understanding Engine
 * Extracts visual attributes, category hierarchy, HS codes, and export characteristics.
 */

export class ProductUnderstandingEngine {
  static evaluate({ rawUnderstanding, customSpecs }) {
    const data = rawUnderstanding || {};
    
    return {
      name: customSpecs?.title || data.detectedName || 'Handcrafted Product',
      category: data.category || 'Home & Living',
      subCategory: data.subCategory || 'Artisanal Craft',
      materials: data.materials || ['Organic Materials', 'Handcrafted Components'],
      aestheticVibe: data.aestheticVibe || 'Boho Organic Luxury',
      targetAudience: data.targetAudience || ['Discerning Global Shoppers', 'Conscious Consumers'],
      hsCodeSuggestion: data.hsCodeSuggestion || '6912.00.00',
      keySellingPoints: data.keySellingPoints || [
        'Premium artisanal quality with authentic craftsmanship',
        'Eco-friendly, sustainable material sourcing',
        'Engineered for international transit safety'
      ],
      logisticsRating: data.logisticsRating || 'Easy',
      weightKg: customSpecs?.weightKg || 1.0,
      initialBatch: customSpecs?.quantity || 100
    };
  }
}
