'use strict';

/**
 * Keyword-based NLP classifier for civic complaints.
 * No external API required.
 */

const CATEGORIES = {
  water: {
    label: 'Water Supply',
    department: 'Water & Sanitation Department',
    icon: 'water',
    keywords: {
      'no water': 8, 'water supply': 8, 'water outage': 8, 'burst pipe': 7,
      'leaking pipe': 7, 'water leakage': 7, 'sewage overflow': 8, 'sewage': 6,
      'drainage': 5, 'flood': 6, 'waterlogged': 6, 'contaminated water': 8,
      'dirty water': 7, 'water pressure': 5, 'pipeline': 5, 'tap': 4,
      'borehole': 4, 'water meter': 4, 'sewage smell': 6, 'blocked drain': 6,
    },
  },
  garbage: {
    label: 'Garbage & Waste',
    department: 'Solid Waste Management',
    icon: 'trash',
    keywords: {
      'garbage': 8, 'trash': 8, 'waste': 6, 'litter': 7, 'rubbish': 8,
      'dump': 6, 'dumping': 7, 'illegal dump': 8, 'overflowing bin': 8,
      'garbage collection': 8, 'solid waste': 7, 'recycling': 4,
      'compost': 3, 'sanitation': 5, 'bin': 4, 'landfill': 5,
      'rotting': 6, 'stink': 5, 'smell': 3, 'pest': 5, 'rodent': 6,
    },
  },
  road: {
    label: 'Road Damage',
    department: 'Public Works & Roads',
    icon: 'road',
    keywords: {
      'pothole': 8, 'road damage': 8, 'broken road': 8, 'cracked road': 7,
      'road repair': 7, 'traffic': 4, 'road accident': 6, 'road sign': 5,
      'speed breaker': 4, 'road marking': 4, 'footpath': 5, 'pavement': 5,
      'sidewalk': 5, 'bridge': 5, 'road light': 5, 'barricade': 4,
      'construction': 3, 'road block': 6, 'crater': 7, 'gravel': 4,
    },
  },
  electricity: {
    label: 'Electricity',
    department: 'Electricity & Power Board',
    icon: 'lightning',
    keywords: {
      'no electricity': 8, 'power cut': 8, 'power outage': 8, 'blackout': 8,
      'electric pole': 7, 'fallen wire': 8, 'live wire': 8, 'short circuit': 7,
      'transformer': 7, 'street light': 6, 'electricity': 5, 'voltage': 5,
      'electric': 4, 'power supply': 6, 'load shedding': 7, 'meter': 4,
      'sparks': 7, 'wire': 4, 'grid': 4,
    },
  },
  parking: {
    label: 'Illegal Parking',
    department: 'Traffic & Parking Authority',
    icon: 'car',
    keywords: {
      'illegal parking': 8, 'wrong parking': 8, 'double parking': 8,
      'vehicle blocking': 7, 'blocking road': 7, 'no parking': 6,
      'car parked': 5, 'abandoned vehicle': 7, 'parking': 5,
      'towing': 5, 'obstruction': 5, 'footpath blocked': 6,
    },
  },
  animals: {
    label: 'Street Animals',
    department: 'Animal Control & Welfare',
    icon: 'paw',
    keywords: {
      'stray dog': 8, 'stray dogs': 8, 'stray cat': 6, 'street animal': 8,
      'dog bite': 8, 'animal attack': 8, 'cow on road': 7, 'cattle': 6,
      'monkey': 6, 'animal menace': 8, 'rabies': 7, 'animal': 3,
      'bitten': 7, 'pet': 2, 'stray': 7,
    },
  },
  washroom: {
    label: 'Public Washroom',
    department: 'Public Health & Sanitation',
    icon: 'toilet',
    keywords: {
      'public toilet': 8, 'washroom': 8, 'restroom': 8, 'dirty toilet': 8,
      'no toilet': 7, 'toilet blocked': 7, 'toilet cleanliness': 8,
      'open defecation': 8, 'urinating': 7, 'public urination': 8,
      'toilet': 5, 'sanitation facility': 6, 'hygiene': 4, 'unhygienic': 6,
    },
  },
};

function classify(text) {
  if (!text || typeof text !== 'string') {
    return {
      category: 'general',
      label: 'General Complaint',
      department: 'Municipal Corporation',
      priority: 'medium',
      confidence: 0,
      icon: 'alert',
    };
  }

  const lower = text.toLowerCase();
  const scores = {};

  for (const [key, cat] of Object.entries(CATEGORIES)) {
    let score = 0;
    for (const [kw, weight] of Object.entries(cat.keywords)) {
      if (lower.includes(kw)) {
        score += weight;
      }
    }
    scores[key] = score;
  }

  const topKey = Object.keys(scores).reduce((a, b) => (scores[a] > scores[b] ? a : b));
  const topScore = scores[topKey];

  let priority;
  if (topScore >= 18) priority = 'critical';
  else if (topScore >= 12) priority = 'high';
  else if (topScore >= 6) priority = 'medium';
  else priority = 'low';

  const maxPossible = 40;
  const confidence = Math.min(topScore / maxPossible, 1);

  if (topScore === 0) {
    return {
      category: 'general',
      label: 'General Complaint',
      department: 'Municipal Corporation',
      priority: 'medium',
      confidence: 0,
      icon: 'alert',
    };
  }

  const cat = CATEGORIES[topKey];
  return {
    category: topKey,
    label: cat.label,
    department: cat.department,
    priority,
    confidence: parseFloat(confidence.toFixed(2)),
    icon: cat.icon,
  };
}

module.exports = { classify };
