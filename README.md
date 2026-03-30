# ⚔️ GitWars — Battle of the Repos

Put any two GitHub repositories into an epic city battle. Stars, commits, contributors, and activity determine which city rises victorious.

## Features

- 🔐 **GitHub OAuth login** via NextAuth.js
- 🏙️ **Live city skylines** generated from real repo metrics
- ⚔️ **Head-to-head stat battle** — stars, forks, commits, contributors, health
- 📈 **Commit activity sparklines** for the past 24 weeks
- 🏆 **Leaderboard** of most popular battles
- 📤 **One-click share** to Twitter/WhatsApp/etc
- 🌙 **Dark cyberpunk UI** with animated effects

---

## Quick Start

### 1. Clone and install

```bash
git clone https://github.com/yourusername/gitwars.git
cd gitwars
npm install
```

### 2. Create a GitHub OAuth App

1. Go to **GitHub → Settings → Developer Settings → OAuth Apps → New OAuth App**
2. Fill in:
   - **Application name**: GitWars
   - **Homepage URL**: `http://localhost:3000`
   - **Authorization callback URL**: `http://localhost:3000/api/auth/callback/github`
3. Click **Register application**
4. Copy your **Client ID** and generate a **Client Secret**

### 3. Set up environment variables

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:

```env
GITHUB_ID=your_client_id_here
GITHUB_SECRET=your_client_secret_here
NEXTAUTH_SECRET=run_openssl_rand_base64_32_and_paste_here
NEXTAUTH_URL=http://localhost:3000
```

Generate `NEXTAUTH_SECRET`:
```bash
openssl rand -base64 32
```

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Deploy to Vercel (Recommended)

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "initial commit"
git remote add origin https://github.com/yourusername/gitwars.git
git push -u origin main
```

### 2. Import to Vercel

1. Go to [vercel.com](https://vercel.com) → **Add New Project**
2. Import your GitHub repo
3. Add environment variables:
   - `GITHUB_ID`
   - `GITHUB_SECRET`
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL` → set to your Vercel URL e.g. `https://gitwars.vercel.app`

### 3. Update GitHub OAuth App

Go back to your GitHub OAuth App settings and update:
- **Homepage URL**: `https://gitwars.vercel.app`
- **Authorization callback URL**: `https://gitwars.vercel.app/api/auth/callback/github`

### 4. Deploy!

Vercel auto-deploys on every push to `main`.

---

## How City Scores Are Calculated

| Metric | Weight |
|---|---|
| ⭐ Stars | ×10 |
| 🍴 Forks | ×8 |
| 📝 Total commits (1yr) | ×2 |
| 🔥 Recent commits (4 weeks) | ×15 |
| 👥 Contributors | ×5 |
| 👁️ Watchers | ×3 |
| 📅 Repo age bonus | up to +50 |

**City levels**: Village → Town → City → Metropolis → Megalopolis → Empire

**City health** = based on days since last push + recent commit activity (0–100%)

---

## Project Structure

```
gitwars/
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/  # GitHub OAuth
│   │   └── github/              # Repo stats API
│   ├── battle/                  # Battle arena page
│   ├── leaderboard/             # Top battles page
│   ├── layout.tsx
│   ├── page.tsx                 # Landing page
│   └── globals.css
├── components/
│   ├── CitySkyline.tsx          # SVG city generator
│   ├── StatBar.tsx              # Comparison bar
│   └── Sparkline.tsx            # Commit activity chart
├── lib/
│   └── github.ts                # GitHub API + scoring
└── .env.local.example
```

---

## Tech Stack

- **Next.js 14** (App Router)
- **NextAuth.js** (GitHub OAuth)
- **Tailwind CSS** (styling)
- **GitHub REST API** (repo data)
- **TypeScript**

---

## License

MIT
