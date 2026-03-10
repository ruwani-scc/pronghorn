/**
 * Completeness Calculator Utility
 * Calculates itinerary completeness percentage
 * Analyzes required fields and item completeness
 */

class CompletenessCalculator {
  /**
   * Calculate overall itinerary completeness
   * @param {Object} itinerary - Itinerary object
   * @param {Array} items - Array of itinerary items
   * @returns {Object} - Completeness metrics
   */
  static calculateCompleteness(itinerary, items = []) {
    const metrics = {
      overall: 0,
      itinerary: 0,
      accommodation: 0,
      activity: 0,
      transport: 0,
      totalScore: 0,
      maxScore: 0,
      missingFields: [],
      recommendations: []
    };
    
    // Calculate itinerary completeness (base info)
    const itineraryMetrics = this.calculateItineraryCompleteness(itinerary);
    metrics.itinerary = itineraryMetrics.percentage;
    metrics.totalScore += itineraryMetrics.score;
    metrics.maxScore += itineraryMetrics.maxScore;
    metrics.missingFields.push(...itineraryMetrics.missingFields);
    
    // Calculate items completeness by category
    const accommodationItems = items.filter(i => i.category === 'accommodation');
    const activityItems = items.filter(i => i.category === 'activity');
    const transportItems = items.filter(i => i.category === 'transport');
    
    if (accommodationItems.length > 0) {
      const accommodationMetrics = this.calculateCategoryCompleteness(accommodationItems, 'accommodation');
      metrics.accommodation = accommodationMetrics.percentage;
      metrics.totalScore += accommodationMetrics.score;
      metrics.maxScore += accommodationMetrics.maxScore;
      metrics.missingFields.push(...accommodationMetrics.missingFields);
    } else {
      metrics.recommendations.push('Add accommodation details for your trip');
    }
    
    if (activityItems.length > 0) {
      const activityMetrics = this.calculateCategoryCompleteness(activityItems, 'activity');
      metrics.activity = activityMetrics.percentage;
      metrics.totalScore += activityMetrics.score;
      metrics.maxScore += activityMetrics.maxScore;
      metrics.missingFields.push(...activityMetrics.missingFields);
    } else {
      metrics.recommendations.push('Add activities to plan your days');
    }
    
    if (transportItems.length > 0) {
      const transportMetrics = this.calculateCategoryCompleteness(transportItems, 'transport');
      metrics.transport = transportMetrics.percentage;
      metrics.totalScore += transportMetrics.score;
      metrics.maxScore += transportMetrics.maxScore;
      metrics.missingFields.push(...transportMetrics.missingFields);
    } else {
      metrics.recommendations.push('Add transport details to your itinerary');
    }
    
    // Calculate overall percentage
    metrics.overall = metrics.maxScore > 0 
      ? Math.round((metrics.totalScore / metrics.maxScore) * 100)
      : 0;
    
    return metrics;
  }
  
  /**
   * Calculate itinerary base information completeness
   */
  static calculateItineraryCompleteness(itinerary) {
    const requiredFields = [
      { field: 'title', weight: 10 },
      { field: 'destination', weight: 10 },
      { field: 'start_date', weight: 10 },
      { field: 'end_date', weight: 10 },
      { field: 'description', weight: 5 }
    ];
    
    let score = 0;
    const maxScore = requiredFields.reduce((sum, f) => sum + f.weight, 0);
    const missingFields = [];
    
    requiredFields.forEach(({ field, weight }) => {
      if (itinerary[field] && itinerary[field].toString().trim() !== '') {
        score += weight;
      } else {
        missingFields.push(`Itinerary ${field}`);
      }
    });
    
    return {
      score,
      maxScore,
      percentage: Math.round((score / maxScore) * 100),
      missingFields
    };
  }
  
  /**
   * Calculate completeness for items in a specific category
   */
  static calculateCategoryCompleteness(items, category) {
    let totalScore = 0;
    let totalMaxScore = 0;
    const missingFields = [];
    
    items.forEach((item, index) => {
      const itemMetrics = this.calculateItemCompleteness(item, category);
      totalScore += itemMetrics.score;
      totalMaxScore += itemMetrics.maxScore;
      
      itemMetrics.missingFields.forEach(field => {
        missingFields.push(`${item.title || `Item ${index + 1}`}: ${field}`);
      });
    });
    
    return {
      score: totalScore,
      maxScore: totalMaxScore,
      percentage: totalMaxScore > 0 ? Math.round((totalScore / totalMaxScore) * 100) : 0,
      missingFields
    };
  }
  
  /**
   * Calculate completeness for a single item
   */
  static calculateItemCompleteness(item, category) {
    const commonFields = [
      { field: 'title', weight: 5 },
      { field: 'start_datetime', weight: 5 },
      { field: 'location', weight: 3 },
      { field: 'confirmation_code', weight: 2 }
    ];
    
    // Category-specific fields
    const categoryFields = {
      accommodation: [
        { field: 'end_datetime', weight: 5 } // Check-out date
      ],
      activity: [
        { field: 'description', weight: 2 },
        { field: 'cost', weight: 2 }
      ],
      transport: [
        { field: 'end_datetime', weight: 5 }, // Arrival time
        { field: 'confirmation_code', weight: 3 }
      ]
    };
    
    const fields = [...commonFields, ...(categoryFields[category] || [])];
    let score = 0;
    const maxScore = fields.reduce((sum, f) => sum + f.weight, 0);
    const missingFields = [];
    
    fields.forEach(({ field, weight }) => {
      if (item[field] && item[field].toString().trim() !== '') {
        score += weight;
      } else {
        missingFields.push(field);
      }
    });
    
    return {
      score,
      maxScore,
      percentage: Math.round((score / maxScore) * 100),
      missingFields
    };
  }
  
  /**
   * Get completeness status badge
   */
  static getCompletenessStatus(percentage) {
    if (percentage >= 90) return { status: 'complete', color: 'green', label: 'Complete' };
    if (percentage >= 70) return { status: 'good', color: 'blue', label: 'Well Planned' };
    if (percentage >= 50) return { status: 'partial', color: 'yellow', label: 'Partially Complete' };
    return { status: 'incomplete', color: 'red', label: 'Needs Attention' };
  }
  
  /**
   * Generate recommendations based on completeness
   */
  static generateRecommendations(metrics) {
    const recommendations = [...metrics.recommendations];
    
    if (metrics.accommodation < 50) {
      recommendations.push('Complete accommodation details including check-in/out times');
    }
    
    if (metrics.activity < 50) {
      recommendations.push('Add more details to your activities including times and locations');
    }
    
    if (metrics.transport < 50) {
      recommendations.push('Fill in transport details including departure/arrival times');
    }
    
    if (metrics.missingFields.length > 0) {
      recommendations.push(`Complete ${metrics.missingFields.length} missing field(s)`);
    }
    
    return recommendations;
  }
}

module.exports = CompletenessCalculator;
