# iForsa Live Backend Setup

## Firebase contact inbox

1. Create a Firebase project.
2. Add a Web app in Firebase project settings.
3. Enable Firestore Database.
4. Enable Authentication > Sign-in method > Anonymous.
5. Add this authorized domain in Firebase Auth:
   `rvey11.github.io`
6. Add the rules from `firebase.rules` to Firestore Rules and publish.
7. In GitHub repo settings, add these as Actions variables:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`

The admin panel signs in anonymously after your admin password is entered. This removes Google sign-in, but it is lighter security than a real backend admin session.

## Daily AI job finder

Add these as GitHub Actions secrets:

- `OPENAI_API_KEY`
- `SERPAPI_API_KEY`

The workflow `.github/workflows/daily-ai-jobs.yml` runs daily at 07:20 UTC and can also be run manually from the Actions tab.

Optional Actions variable:

- `OPENAI_MODEL` defaults to `gpt-5.2`

When the workflow finds a new opportunity, it edits `src/data/mockData.js`, commits it, and GitHub Pages redeploys.
