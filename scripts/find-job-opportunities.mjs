import fs from 'node:fs/promises';

const DATA_FILE = new URL('../src/data/mockData.js', import.meta.url);

const serpApiKey = process.env.SERPAPI_API_KEY;
const hfApiKey = process.env.HUGGINGFACE_API_KEY;

if (!serpApiKey || !hfApiKey) {
  console.log('Missing SERPAPI_API_KEY or HUGGINGFACE_API_KEY. Skipping.');
  process.exit(0);
}

const safeExit = (msg) => {
  console.log(msg);
  process.exit(0);
};

// --------------------
// 1. SEARCH JOBS (SERPAPI)
// --------------------
const searchUrl = new URL('https://serpapi.com/search.json');
searchUrl.searchParams.set('engine', 'google');
searchUrl.searchParams.set(
  'q',
  'site:dreamjob.ma OR site:anapec.org emploi Maroc recrutement concours opportunite'
);
searchUrl.searchParams.set('hl', 'fr');
searchUrl.searchParams.set('gl', 'ma');
searchUrl.searchParams.set('api_key', serpApiKey);

let searchResponse;

try {
  searchResponse = await fetch(searchUrl);
} catch (err) {
  safeExit(`SerpAPI failed: ${err.message}`);
}

if (!searchResponse.ok) {
  safeExit(`SerpAPI error: ${searchResponse.status}`);
}

const searchData = await searchResponse.json();

const candidates = (searchData.organic_results || [])
  .filter(r => r.title && r.link)
  .slice(0, 5)
  .map(r => ({
    title: r.title,
    link: r.link,
    snippet: r.snippet || ''
  }));

if (!candidates.length) {
  safeExit('No candidates found.');
}

const source = await fs.readFile(DATA_FILE, 'utf8');

const unused = candidates.filter(c => !source.includes(c.link));

if (!unused.length) {
  safeExit('No new opportunities.');
}

const picked = unused[0];

// --------------------
// 2. PROMPT FOR HF
// --------------------
const prompt = `
Return ONLY valid JSON.

Create a Moroccan job post:

{
  "title": "",
  "category": "",
  "image": "",
  "location": "",
  "description": "",
  "requirements": "",
  "link": ""
}

Use this job:
Title: ${picked.title}
Snippet: ${picked.snippet}
Link: ${picked.link}
`;

// --------------------
// 3. HUGGING FACE CALL (FIXED)
// --------------------
const hfResponse = await fetch(
  'https://api-inference.huggingface.co/models/google/flan-t5-base',
  {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${hfApiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      inputs: prompt,
      parameters: {
        max_new_tokens: 400
      }
    })
  }
);

if (!hfResponse.ok) {
  const errText = await hfResponse.text();
  safeExit(`Hugging Face API failed: ${hfResponse.status} - ${errText}`);
}

const hfData = await hfResponse.json();

// HF returns different formats depending on model
const raw =
  hfData?.[0]?.generated_text ||
  hfData?.generated_text ||
  hfData?.[0]?.text ||
  '';

if (!raw) {
  safeExit('HF returned empty response.');
}

// --------------------
// 4. PARSE JSON SAFELY
// --------------------
let post;

try {
  const match = raw.match(/\{[\s\S]*\}/);
  post = JSON.parse(match ? match[0] : raw);
} catch {
  safeExit('Failed to parse JSON from HF output.');
}

// --------------------
// 5. BUILD FINAL POST
// --------------------
const newPost = {
  id: Date.now(),
  title: post.title || picked.title,
  category: post.category || 'Emploi',
  image:
    post.image ||
    'https://images.unsplash.com/photo-1556761175-b413da4baf72?q=80&w=1200',
  date: new Date().toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }),
  location: post.location || 'Maroc',
  trending: true,
  description: post.description || picked.snippet,
  requirements: post.requirements || 'Voir détails sur le site officiel',
  link: post.link || picked.link
};

// --------------------
// 6. SAVE TO FILE
// --------------------
const postText = `\n  ${JSON.stringify(newPost, null, 2)},`;

const updated = source.replace(
  'export const INITIAL_POSTS = [',
  `export const INITIAL_POSTS = [${postText}`
);

await fs.writeFile(DATA_FILE, updated);

console.log(`Added new opportunity: ${newPost.title}`);
