import fs from 'node:fs/promises';
import OpenAI from 'openai';

const DATA_FILE = new URL('../src/data/mockData.js', import.meta.url);
const serpApiKey = process.env.SERPAPI_API_KEY;
const openaiApiKey = process.env.OPENAI_API_KEY;
const model = process.env.OPENAI_MODEL || 'gpt-5.2';

if (!serpApiKey || !openaiApiKey) {
  console.log('Missing SERPAPI_API_KEY or OPENAI_API_KEY. Skipping.');
  process.exit(0);
}

const searchUrl = new URL('https://serpapi.com/search.json');
searchUrl.searchParams.set('engine', 'google');
searchUrl.searchParams.set('q', 'site:dreamjob.ma OR site:anapec.org emploi Maroc recrutement concours opportunite');
searchUrl.searchParams.set('hl', 'fr');
searchUrl.searchParams.set('gl', 'ma');
searchUrl.searchParams.set('api_key', serpApiKey);

const searchResponse = await fetch(searchUrl);

if (!searchResponse.ok) {
  throw new Error(`SerpAPI failed: ${searchResponse.status} ${await searchResponse.text()}`);
}

const searchData = await searchResponse.json();
const candidates = (searchData.organic_results || [])
  .filter((result) => result.title && result.link)
  .slice(0, 8)
  .map((result) => ({
    title: result.title,
    link: result.link,
    snippet: result.snippet || ''
  }));

if (!candidates.length) {
  console.log('No search candidates found.');
  process.exit(0);
}

const source = await fs.readFile(DATA_FILE, 'utf8');
const unusedCandidates = candidates.filter((candidate) => !source.includes(candidate.link));

if (!unusedCandidates.length) {
  console.log('All search candidates already exist in mockData.js.');
  process.exit(0);
}

const client = new OpenAI({ apiKey: openaiApiKey });
const response = await client.responses.create({
  model,
  instructions: [
    'You create concise job-opportunity articles for iForsa, a Moroccan jobs website.',
    'Return only valid JSON. No markdown.',
    'Use French unless the source title is clearly Arabic.',
    'Do not invent salary, deadlines, or application requirements that are not supported by the search result.',
    'If details are missing, use cautious wording and direct readers to the official link.'
  ].join('\n'),
  input: JSON.stringify({
    task: 'Pick the best candidate and produce one post object.',
    schema: {
      title: 'string',
      category: 'Emploi | ANAPEC | Alwadifa | Immigration | Sport | Stage | France',
      image: 'string URL',
      location: 'string',
      trending: true,
      description: 'string, 1-2 sentences',
      requirements: 'string, cautious profile/requirements',
      link: 'string URL'
    },
    imageGuidance: 'Use this image if no better image is available: https://images.unsplash.com/photo-1556761175-b413da4baf72?q=80&w=1200',
    candidates: unusedCandidates
  })
});

const rawText = response.output_text.trim();
const post = JSON.parse(rawText);

if (!post.title || !post.link || source.includes(post.link)) {
  console.log('Generated post is missing required data or already exists.');
  process.exit(0);
}

const newPost = {
  id: Date.now(),
  title: post.title,
  category: post.category || 'Emploi',
  image: post.image || 'https://images.unsplash.com/photo-1556761175-b413da4baf72?q=80&w=1200',
  date: new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }),
  location: post.location || 'Maroc',
  trending: true,
  description: post.description,
  requirements: post.requirements,
  link: post.link
};

const postText = `\n  ${JSON.stringify(newPost, null, 2).replace(/\n/g, '\n  ')},`;
const updatedSource = source.replace('export const INITIAL_POSTS = [', `export const INITIAL_POSTS = [${postText}`);

await fs.writeFile(DATA_FILE, updatedSource);
console.log(`Added new opportunity: ${newPost.title}`);
