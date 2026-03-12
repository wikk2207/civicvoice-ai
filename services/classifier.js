'use strict';

const CATEGORIES = {
  Infrastructure: {
    department: 'Public Works Department',
    keywords: ['road', 'pothole', 'bridge', 'street', 'footpath', 'pavement', 'drainage',
      'construction', 'building', 'crack', 'collapse', 'broken', 'repair', 'maintenance',
      'sidewalk', 'highway', 'overpass', 'tunnel', 'culvert', 'flood', 'waterlogging']
  },
  Sanitation: {
    department: 'Municipal Sanitation Department',
    keywords: ['garbage', 'trash', 'waste', 'sewage', 'sewer', 'drain', 'stench', 'smell',
      'odor', 'dump', 'littering', 'open defecation', 'toilet', 'latrine', 'cleaning',
      'sweeping', 'sanitation', 'hygiene', 'dustbin', 'bins', 'overflow']
  },
  'Water Supply': {
    department: 'Water Supply & Sewerage Board',
    keywords: ['water', 'pipeline', 'pipe', 'leakage', 'leak', 'supply', 'shortage',
      'contamination', 'dirty water', 'brown water', 'no water', 'tap', 'borewell',
      'tanker', 'sewage water', 'drinking water', 'pressure', 'pump']
  },
  Electricity: {
    department: 'Electricity Board',
    keywords: ['electricity', 'power', 'outage', 'blackout', 'light', 'streetlight',
      'street light', 'transformer', 'wire', 'cable', 'electric', 'voltage', 'short circuit',
      'spark', 'pole', 'meter', 'bill', 'load shedding', 'generator', 'cut']
  },
  Transportation: {
    department: 'Transport Department',
    keywords: ['bus', 'traffic', 'signal', 'auto', 'taxi', 'rickshaw', 'parking',
      'transport', 'vehicle', 'speed', 'accident', 'railway', 'train', 'metro',
      'congestion', 'jam', 'rash driving', 'horn', 'route', 'stop', 'overspeed']
  },
  'Public Safety': {
    department: 'Police Department',
    keywords: ['theft', 'robbery', 'crime', 'violence', 'harassment', 'unsafe', 'danger',
      'police', 'security', 'assault', 'eve teasing', 'stalking', 'vandalism', 'graffiti',
      'fight', 'noise', 'disturbance', 'illegal', 'drug', 'drunk driving', 'encroachment']
  },
  Environment: {
    department: 'Environment & Pollution Control Board',
    keywords: ['pollution', 'smoke', 'air', 'noise', 'dust', 'chemical', 'factory',
      'industrial', 'burning', 'fire', 'deforestation', 'tree', 'green', 'park',
      'lake', 'river', 'pond', 'encroachment', 'illegal construction', 'mining', 'quarry']
  },
  Healthcare: {
    department: 'Health Department',
    keywords: ['hospital', 'doctor', 'medicine', 'clinic', 'health', 'medical', 'nurse',
      'ambulance', 'disease', 'epidemic', 'stray dog', 'mosquito', 'malaria', 'dengue',
      'rat', 'pest', 'infestation', 'vaccination', 'pharmacy', 'emergency', 'death']
  },
  Education: {
    department: 'Education Department',
    keywords: ['school', 'college', 'university', 'teacher', 'student', 'education',
      'class', 'classroom', 'library', 'book', 'fee', 'scholarship', 'hostel',
      'mid day meal', 'attendance', 'dropout', 'tuition', 'examination', 'result']
  }
};

const PRIORITY_KEYWORDS = {
  critical: ['fire', 'explosion', 'collapse', 'death', 'accident', 'flood', 'emergency',
    'spark', 'short circuit', 'gas leak', 'violence', 'assault', 'robbery', 'epidemic',
    'disease outbreak', 'chemical spill', 'hazardous', 'dangerous', 'imminent'],
  high: ['no water', 'power outage', 'blackout', 'sewage overflow', 'pothole', 'unsafe',
    'crime', 'harassment', 'contamination', 'broken pipe', 'burst pipe', 'blocked drain',
    'garbage overflowing', 'illegal', 'encroachment', 'no electricity'],
  medium: ['shortage', 'irregular', 'dirty', 'leakage', 'broken', 'damage', 'noise',
    'smell', 'stench', 'complaint', 'issue', 'problem', 'concern', 'request'],
  low: ['suggestion', 'feedback', 'inquiry', 'information', 'general', 'minor', 'small']
};

function classifyComplaint(text) {
  if (!text || typeof text !== 'string') {
    return { category: 'Other', department: 'General Administration', priority: 'medium', confidence: 0 };
  }

  const lower = text.toLowerCase();
  const words = lower.split(/\s+/);

  // Score each category
  const scores = {};
  for (const [category, data] of Object.entries(CATEGORIES)) {
    let score = 0;
    for (const keyword of data.keywords) {
      if (lower.includes(keyword)) {
        // Longer keyword matches get higher weight
        score += keyword.split(' ').length;
      }
    }
    scores[category] = score;
  }

  // Find best category
  let bestCategory = 'Other';
  let bestScore = 0;
  for (const [category, score] of Object.entries(scores)) {
    if (score > bestScore) {
      bestScore = score;
      bestCategory = category;
    }
  }

  const department = bestCategory === 'Other'
    ? 'General Administration'
    : CATEGORIES[bestCategory].department;

  // Determine priority
  let priority = 'medium';
  for (const [level, keywords] of Object.entries(PRIORITY_KEYWORDS)) {
    for (const keyword of keywords) {
      if (lower.includes(keyword)) {
        priority = level;
        break;
      }
    }
    if (priority !== 'medium' || level === 'medium') break;
  }
  // Re-check in priority order
  for (const level of ['critical', 'high', 'medium', 'low']) {
    let matched = false;
    for (const keyword of PRIORITY_KEYWORDS[level]) {
      if (lower.includes(keyword)) {
        priority = level;
        matched = true;
        break;
      }
    }
    if (matched) break;
  }

  // Confidence: normalize score against max possible
  const totalKeywords = CATEGORIES[bestCategory]
    ? CATEGORIES[bestCategory].keywords.length
    : 1;
  const confidence = bestScore > 0
    ? Math.min(Math.round((bestScore / totalKeywords) * 100), 99)
    : 0;

  return { category: bestCategory, department, priority, confidence };
}

module.exports = { classifyComplaint, CATEGORIES };
