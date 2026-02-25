# Labelwise

Labelwise is a Next.js app that analyzes nutrition labels using the OpenAI API.

This project is configured to deploy cleanly to Vercel.

## 1. Local setup

```bash
pnpm install
cp .env.example .env.local
```

Edit `.env.local` and set:

```bash
OPENAI_API_KEY=your-real-openai-api-key
```

Then run the dev server:

```bash
pnpm dev
```

Visit `http://localhost:3000` to confirm it works.

## 2. Deploying to Vercel (GitHub flow – recommended)

1. Initialize git (if you haven’t already):

   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```

2. Create a new repository on GitHub and follow its instructions, typically:

   ```bash
   git branch -M main
   git remote add origin https://github.com/<your-username>/<repo-name>.git
   git push -u origin main
   ```

3. Go to `https://vercel.com` and log in.
4. Click **“Add New → Project”** and import the GitHub repo.
5. Vercel will auto-detect **Next.js** and use the default settings:
   - **Build Command**: `next build`
   - **Output Directory**: (Next.js default, no change needed)
6. Click **Deploy**.

### Add environment variables on Vercel

After the project is created:

1. In Vercel, open your project → **Settings → Environment Variables**.
2. Add:

   - **Name**: `OPENAI_API_KEY`  
   - **Value**: your real OpenAI API key  
   - **Environments**: Production (and Preview if desired)

3. Save, then go to **Deployments** and trigger a **Redeploy** so the new env var is picked up.

Once the redeploy finishes, your live app will be able to call the `/api/analyze-label` endpoint successfully.

## 3. Deploying with Vercel CLI (alternative)

If you prefer deploying directly from your machine without GitHub:

1. Install the Vercel CLI globally (optional) or use `npx`:

   ```bash
   pnpm dlx vercel@latest
   # or
   npx vercel@latest
   ```

2. From the project root, run:

   ```bash
   npx vercel
   ```

   - Log in when prompted.
   - When asked:
     - **“Set up and deploy?”** → Yes
     - **“Which scope?”** → choose your personal account
     - **“Link to existing project?”** → usually “No, create a new project”
     - Accept defaults for framework detection (Next.js).

3. For a production deployment:

   ```bash
   npx vercel --prod
   ```

4. In the Vercel dashboard, add the `OPENAI_API_KEY` env var under **Settings → Environment Variables**, then redeploy if necessary.

# Product Nutrition Analysis

Tactical nutrition intelligence system. Scan product labels, analyze macros, calculate BMI, and get AI-generated diet protocols.

## Features

- **Label Scanner** – Upload product images; AI extracts nutrition data (OpenAI GPT-4 Vision)
- **BMI Calculator** – Calculate and track your BMI
- **Diet Planner** – Generate personalized diet plans based on your goals

## Setup

1. **Install dependencies**
   ```bash
   pnpm install
   ```

2. **Add OpenAI API key** (for label scanning)
   
   Copy `.env.example` to `.env.local` and add your key:
   ```bash
   cp .env.example .env.local
   ```
   Edit `.env.local` and set `OPENAI_API_KEY=sk-your-key`. Get a key at [platform.openai.com/api-keys](https://platform.openai.com/api-keys).

3. **Run the app**
   ```bash
   pnpm dev
   ```

Open [http://localhost:3000](http://localhost:3000).

## Tech Stack

- Next.js 16
- React 19
- Tailwind CSS
- OpenAI GPT-4 Vision
