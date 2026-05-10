import fs from 'node:fs/promises';

const DATA_FILE = new URL('../src/data/mockData.js', import.meta.url);

const SERP_API_KEY = process.env.SERPAPI_API_KEY;
const GROQ_API_KEY = process.env.GROQ_API_KEY;

if (!SERP_API_KEY || !GROQ_API_KEY) {
  console.log('Missing SERPAPI_API_KEY or GROQ_API_KEY. Skipping.');
  process.exit(0);
}

const safeExit = (msg) => {
  console.log(msg);
  process.exit(0);
};

// --------------------
// 1. SERPAPI SEARCH
// --------------------
const searchUrl = new URL('https://serpapi.com/search.json');
searchUrl.searchParams.set('engine', 'google');
searchUrl.searchParams.set(
  'q',
  'site:dreamjob.ma OR site:anapec.org emploi Maroc recrutement concours opportunite'
);
searchUrl.searchParams.set('hl', 'fr');
searchUrl.searchParams.set('gl', 'ma');
searchUrl.searchParams.set('api_key', SERP_API_KEY);

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

// --------------------
// 2. LOAD EXISTING DATA
// --------------------
const source = await fs.readFile(DATA_FILE, 'utf8');

const unused = candidates.filter(c => !source.includes(c.link));

if (!unused.length) {
  safeExit('No new opportunities.');
}

const picked = unused[0];

// --------------------
// 3. GROQ AI GENERATION
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

Job:
Title: ${picked.title}
Snippet: ${picked.snippet}
Link: ${picked.link}
`;

const groqResponse = await fetch(
  'https://api.groq.com/openai/v1/chat/completions',
  {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${GROQ_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'llama-3.1-8b-instant',
      messages: [
        {
          role: 'system',
          content: 'Return ONLY valid JSON. No markdown. No explanation.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7
    })
  }
);

if (!groqResponse.ok) {
  const err = await groqResponse.text();
  safeExit(`Groq API failed: ${groqResponse.status} - ${err}`);
}

const data = await groqResponse.json();

const raw = data?.choices?.[0]?.message?.content;

if (!raw) {
  safeExit('Groq returned empty response.');
}

// --------------------
// 4. PARSE JSON
// --------------------
let post;

try {
  const match = raw.match(/\{[\s\S]*\}/);
  post = JSON.parse(match ? match[0] : raw);
} catch {
  safeExit('Failed to parse Groq JSON.');
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
