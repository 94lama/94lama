#!/usr/bin/env node
// Update the skill radar polygon points in README.md and public SVG
// based on public/assets/cv.json content.
const fs = require('fs');
const path = require('path');

const CV_PATH = path.join(__dirname, '../public/assets/cv.json');
const README_PATH = path.join(__dirname, '../README.md');
const SVG_PATH = path.join(__dirname, '../public/assets/readme/skill-radar.svg');

function safeReadJSON(p) {
  if (!fs.existsSync(p)) throw new Error(`Missing file: ${p}`);
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

function avgKnowledge(skills, category) {
  if (!Array.isArray(skills)) return 0;
  const cat = skills.find(s => String(s.category).toLowerCase() === String(category).toLowerCase());
  if (!cat || !Array.isArray(cat.entries) || cat.entries.length === 0) return 0;
  const sum = cat.entries.reduce((acc, e) => acc + (Number(e.knowledge) || 0), 0);
  return sum / cat.entries.length;
}

function countKeywords(text, keywords) {
  if (!text) return 0;
  const t = String(text).toLowerCase();
  let count = 0;
  for (const k of keywords) if (t.includes(k.toLowerCase())) count++;
  return count;
}

function findEntriesWithKeywords(skills, keywords) {
  const found = [];
  for (const cat of (skills || [])) {
    for (const e of (cat.entries || [])) {
      const label = String(e.label || '').toLowerCase();
      for (const k of keywords) {
        if (label.includes(k.toLowerCase())) {
          found.push(e);
          break;
        }
      }
    }
  }
  return found;
}

function computeRatings(cv) {
  const skills = cv.skills || [];
  const frontendAvg = avgKnowledge(skills, 'Frontend') * 100; // 0..100
  const backendAvg = avgKnowledge(skills, 'Backend') * 100;
  const devopsAvg = avgKnowledge(skills, 'DevOps') * 100;
  const databasesAvg = avgKnowledge(skills, 'Databases') * 100;

  const frontend = Math.round(frontendAvg);
  const backend = Math.round(backendAvg);
  const devops = Math.round(devopsAvg);
  const databases = Math.round(databasesAvg);

  // Text sources for keyword scanning
  const summary = cv.summary || '';
  const experiences = Array.isArray(cv.experience) ? cv.experience : [];
  const highlightsText = experiences.map(e => (e.highlights || []).join(' ')).join(' ');
  const educationText = Array.isArray(cv.education) ? cv.education.join(' ') : '';
  const projects = Array.isArray(cv.projects) ? cv.projects : [];
  const projectsText = projects.map(p => `${p.name || ''} ${p.description || ''}`).join(' ');
  const combinedText = `${summary} ${highlightsText} ${projectsText} ${educationText}`;

  // Keywords
  const aiKeywords = ['ai', 'ai-based', 'agentic', 'agent', 'workflow', 'workflows', 'pipeline', 'pipelines', 'llm', 'model', 'models'];
  const apiKeywords = ['api', 'rest', 'graphql', 'integration', 'integrations', 'endpoint', 'webhook'];
  const archKeywords = ['architecture', 'architect', 'schema', 'database architecture', 'design', 'adr'];

  const aiMatches = countKeywords(combinedText, aiKeywords);
  const apiMatches = countKeywords(combinedText, apiKeywords);
  const archMatches = countKeywords(`${combinedText} ${educationText}`, archKeywords);

  // More robust signals for Agentic AI
  // 1) keyword density normalized by number of experience items
  const contextCount = Math.max(1, experiences.length);
  const aiDensity = Math.min(1, aiMatches / contextCount);

  // 2) count how many experiences/projects explicitly mention AI-related terms
  let aiItems = 0;
  for (const e of experiences) {
    const text = `${e.role || ''} ${e.company || ''} ${(e.highlights || []).join(' ')}`.toLowerCase();
    if (aiKeywords.some(k => text.includes(k))) aiItems++;
  }
  for (const p of projects) {
    const text = `${p.name || ''} ${p.description || ''}`.toLowerCase();
    if (aiKeywords.some(k => text.includes(k))) aiItems++;
  }
  const aiItemsNormalized = Math.min(1, aiItems / 3); // 3+ items -> full credit

  // 3) check if any explicit skill entries reference AI/ML and average their knowledge
  const aiSkillEntries = findEntriesWithKeywords(skills, ['ai', 'ml', 'model', 'llm', 'pipeline', 'workflow']);
  const aiSkillRatio = aiSkillEntries.length > 0 ? (aiSkillEntries.reduce((s, e) => s + (Number(e.knowledge) || 0), 0) / aiSkillEntries.length) : 0;

  // Agentic AI score composition (max 80)
  const agenticRaw = 10 + (aiDensity * 30) + (aiItemsNormalized * 20) + (aiSkillRatio * 20);
  let agentic = Math.round(Math.min(80, agenticRaw)); // enforce 80 cap as requested

  // API/Integration: blend of backend/frontend knowledge with explicit API mentions
  const api = Math.round((backend * 0.6) + (frontend * 0.25) + (Math.min(1, apiMatches / Math.max(1, contextCount)) * 100 * 0.15));

  // Architecture: blend of databases + backend + frontend, small boost if arch keywords present
  const architectureBase = Math.round((databases * 0.5) + (backend * 0.25) + (frontend * 0.25));
  const architecture = Math.min(100, architectureBase + (archMatches > 0 ? 10 : 0));

  const ratings = {
    Frontend: clamp(frontend),
    'API/Integration': clamp(api),
    Backend: clamp(backend),
    DevOps: clamp(devops),
    'Agentic AI': clamp(agentic),
    Architecture: clamp(architecture),
  };

  // Allow explicit overrides in cv.json under `ratings_override` (optional)
  if (cv.ratings_override && typeof cv.ratings_override === 'object') {
    for (const k of Object.keys(ratings)) {
      if (Object.prototype.hasOwnProperty.call(cv.ratings_override, k)) {
        const v = Number(cv.ratings_override[k]);
        if (!Number.isNaN(v)) ratings[k] = clamp(v);
      }
    }
  }

  return ratings;
}

function clamp(n) {
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.min(100, Math.round(n)));
}

function ratingsToPolygonPts(ratings) {
  // Order: Frontend, API/Integration, Backend, DevOps, Agentic AI, Architecture
  const order = ['Frontend', 'API/Integration', 'Backend', 'DevOps', 'Agentic AI', 'Architecture'];
  const R = 95; // same radius used in the SVGs
  const pts = order.map((k, i) => {
    const rating = ratings[k] || 0;
    const angleDeg = -90 + i * 60;
    const rad = (angleDeg * Math.PI) / 180;
    const dist = (R * rating) / 100;
    const x = Math.round(dist * Math.cos(rad));
    const y = Math.round(dist * Math.sin(rad));
    return `${x},${y}`;
  });
  return pts.join(' ');
}

function replacePolygonPoints(content, newPoints) {
  // Replace first polygon points attribute occurrence (double or single quotes)
  const polygonRegex = /(<polygon\b[^>]*\bpoints=")([^"]*)("[^>]*>)/i;
  if (polygonRegex.test(content)) return content.replace(polygonRegex, `$1${newPoints}$3`);
  const polygonRegex2 = /(<polygon\b[^>]*\bpoints=')([^']*)(')/i;
  if (polygonRegex2.test(content)) return content.replace(polygonRegex2, `$1${newPoints}$3`);
  throw new Error('Could not find polygon points attribute to replace');
}

function replaceRatingsComment(content, ratings) {
  const line = `<!-- Ratings used (0-100): Frontend ${ratings['Frontend']}, API/Integration ${ratings['API/Integration']}, Backend ${ratings['Backend']}, DevOps ${ratings['DevOps']}, Agentic AI ${ratings['Agentic AI']}, Architecture ${ratings['Architecture']} -->`;
  const commentRegex = /<!--\s*Ratings used \(0-100\):[^-]*-->/i;
  if (commentRegex.test(content)) return content.replace(commentRegex, line);
  const polygonStart = content.search(/<polygon\b/i);
  if (polygonStart !== -1) {
    return content.slice(0, polygonStart) + line + '\n' + content.slice(polygonStart);
  }
  return content;
}

function updateFile(filePath, ratings, newPoints) {
  let content = fs.readFileSync(filePath, 'utf8');
  content = replaceRatingsComment(content, ratings);
  content = replacePolygonPoints(content, newPoints);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated ${filePath}`);
}

function main() {
  try {
    const cv = safeReadJSON(CV_PATH);
    const ratings = computeRatings(cv);
    const pts = ratingsToPolygonPts(ratings);

    // Update both README.md and the public SVG
    updateFile(README_PATH, ratings, pts);
    updateFile(SVG_PATH, ratings, pts);

    console.log('Ratings computed:', ratings);
    console.log('Polygon points:', pts);
  } catch (err) {
    console.error('Error updating skill radar:', err.message);
    process.exit(1);
  }
}

if (require.main === module) main();
