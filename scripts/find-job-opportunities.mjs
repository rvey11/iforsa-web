import fs from 'node:fs/promises';

const DATA_FILE = new URL('../src/data/mockData.js', import.meta.url);

const serpApiKey = process.env.SERPAPI_API_KEY;
const huggingfaceApiKey = process.env.HUGGINGFACE_API_KEY;

if (!serpApiKey || !huggingfaceApiKey) {
  console.log('Missing SERPAPI_API_KEY or HUGGINGFACE_API_KEY. Skipping.');
  process.exit(0);
}

const searchUrl = new URL('https://serpapi.com/search.json');

searchUrl.searchParams.set('engine', 'google');
searchUrl.searchParams.set(
  'q',
  'site:dreamjob.ma OR site:anapec.org emploi Maroc recrutement concours opportunite'
);
searchUrl.searchParams.set('hl', 'fr');
searchUrl.searchParams.set('gl', 'ma');
searchUrl.searchParams.set('api_key', serpApiKey);

const safeExit = (message) => {
  console.log(message);
  process.exit(0);
};

let searchResponse;

try {
  searchResponse = await fetch(searchUrl);
} catch (error) {
  safeExit(`SerpAPI request failed: ${error.message}`);
}

if (!searchResponse.ok) {
  safeExit(`SerpAPI failed: ${searchResponse.status}`);
}

const searchData = await searchResponse.json();

const candidates = (searchData.organic_results || [])
  .filter((result) => result.title && result.link)
  .slice(0, 5)
  .map((result) => ({
    title: result.title,
    link: result.link,
    snippet: result.snippet || ''
  }));

if (!candidates.length) {
  safeExit('No candidates found.');
}

const source = await fs.readFile(DATA_FILE, 'utf8');

const unusedCandidates = candidates.filter(
  (candidate) => !source.includes(candidate.link)
);

if (!unusedCandidates.length) {
  safeExit('All opportunities already exist.');
}

const selected = unusedCandidates[0];

const prompt = `
Create a concise Moroccan job opportunity JSON object.

Return ONLY valid JSON.

Format:
{
  "title": "",
  "category": "",
  "image": "",
  "location": "",
  "description": "",
  "requirements": "",
  "link": ""
}

Candidate:
Title: ${selected.title}
Snippet: ${selected.snippet}
Link: ${selected.link}
`;

let hfResponse;

try {
  hfResponse = await fetch(
    'https://api-inference.huggingface.co/models/google/flan-t5-large',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${huggingfaceApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        inputs: prompt
      })
    }
  );
} catch (error) {
  safeExit(`Hugging Face request failed: ${error.message}`);
}

if (!hfResponse.ok) {
  safeExit(`Hugging Face API failed: ${hfResponse.status}`);
}

const hfData = await hfResponse.json();

const generatedText = hfData?.[0]?.generated_text;

if (!generatedText) {
  safeExit('No generated text returned.');
}

let post;

try {
  post = JSON.parse(generatedText);
} catch {
  safeExit('Failed to parse Hugging Face JSON.');
}

const newPost = {
  id: Date.now(),
  title: post.title || selected.title,
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
  description: post.description || selected.snippet,
  requirements: post.requirements || 'Consultez l’annonce officielle.',
  link: post.link || selected.link
};

const postText = `\n  ${JSON.stringify(newPost, null, 2).replace(
  /\n/g,
  '\n  '
)},`;

const updatedSource = source.replace(
  'export const INITIAL_POSTS = [',
  `export const INITIAL_POSTS = [${postText}`
);

await fs.writeFile(DATA_FILE, updatedSource);

console.log(`Added new opportunity: ${newPost.title}`);
