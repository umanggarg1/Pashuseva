# 🚀 PashuSeva — Deployment Guide
## Frontend → Vercel | Backend → Render

---

## Overview

```
GitHub Repo
    │
    ├── pashuseva/backend/   ──▶  Render (Node.js API)
    │                              https://pashuseva-api.onrender.com
    │
    └── pashuseva/frontend/  ──▶  Vercel (React SPA)
                                   https://pashuseva.vercel.app
```

---

## Part 1 — Deploy Backend on Render

### Step 1: Push to GitHub
Push your project to a GitHub repository.

### Step 2: Create Render Web Service
1. Go to [render.com](https://render.com) and sign up/log in
2. Click **New +** → **Web Service**
3. Connect your GitHub repo
4. Configure the service:

| Setting | Value |
|---------|-------|
| **Name** | `pashuseva-api` |
| **Root Directory** | `pashuseva/backend` |
| **Environment** | `Node` |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |
| **Plan** | Free |

### Step 3: Set Environment Variables on Render
In your Render service → **Environment** tab, add these variables:

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `HOST` | `0.0.0.0` |
| `PORT` | `10000` |
| `CORS_ORIGIN` | *(leave blank for now — fill in after Vercel deploy)* |
| `ADMIN_USERNAME` | `admin` |
| `ADMIN_PASSWORD` | `pashuseva123` |
| `ADMIN_TOKEN` | `pashuseva-admin-token-2024` |
| `JWT_SECRET` | *(use a long random string in production)* |
| `JWT_EXPIRES_IN` | `7d` |

> ⚠️ **DO NOT** set `CORS_ORIGIN` to `*` in production. Leave it blank for now and fill it in after you get your Vercel URL.

### Step 4: Deploy
Click **Deploy Web Service**. Wait for the build to complete.

You'll get a URL like: `https://pashuseva-api.onrender.com`

### Step 5: Test your backend
Open in browser:
```
https://pashuseva-api.onrender.com/api/health
```
You should see: `{ "status": "ok" }`

---

## Part 2 — Deploy Frontend on Vercel

### Step 1: Set VITE_API_URL
Open `pashuseva/frontend/.env.production` and replace the placeholder:
```env
VITE_API_URL=https://pashuseva-api.onrender.com
```
*(Use your actual Render URL from Part 1 Step 4)*

Commit and push this change to GitHub.

### Step 2: Create Vercel Project
1. Go to [vercel.com](https://vercel.com) and sign up/log in
2. Click **Add New** → **Project**
3. Import your GitHub repository
4. Configure:

| Setting | Value |
|---------|-------|
| **Root Directory** | `pashuseva/frontend` |
| **Framework Preset** | `Vite` |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |
| **Install Command** | `npm install` |

### Step 3: Add Environment Variable on Vercel
In Vercel project → **Settings** → **Environment Variables**, add:

| Key | Value | Environment |
|-----|-------|-------------|
| `VITE_API_URL` | `https://pashuseva-api.onrender.com` | Production, Preview, Development |

> This overrides `.env.production` and is the recommended approach for Vercel.

### Step 4: Deploy
Click **Deploy**. Vercel builds and gives you a URL like:
```
https://pashuseva.vercel.app
```

---

## Part 3 — Final CORS Connection

Now that you have both URLs, go back to **Render**:

1. Render Dashboard → your `pashuseva-api` service → **Environment**
2. Set `CORS_ORIGIN` to your Vercel URL:
   ```
   https://pashuseva.vercel.app
   ```
   If you have multiple URLs (www + non-www), separate with a comma:
   ```
   https://pashuseva.vercel.app,https://www.pashuseva.vercel.app
   ```
3. Click **Save Changes** — Render will redeploy automatically

---

## ✅ Verification Checklist

After both are deployed:

- [ ] `https://your-render-url.onrender.com/api/health` returns `{"status":"ok"}`
- [ ] `https://your-render-url.onrender.com/api/products` returns product list
- [ ] `https://your-vercel-app.vercel.app` loads the homepage
- [ ] Products load on the Products page
- [ ] Login and Signup work
- [ ] Admin login works (`admin` / `pashuseva123`)
- [ ] Dark mode toggle works

---

## Local Development (unchanged)

```bash
# Terminal 1 — Backend
cd pashuseva/backend
npm install
npm run dev          # runs on localhost:5000

# Terminal 2 — Frontend
cd pashuseva/frontend
npm install
npm run dev          # runs on localhost:3000, proxies /api → :5000
```

---

## Troubleshooting

### ❌ "Failed to fetch" / CORS error in browser console
- Make sure `CORS_ORIGIN` on Render matches your exact Vercel URL
- No trailing slash in the URL
- Redeploy the Render service after changing env vars

### ❌ Products page is blank / API calls fail
- Check the browser Network tab — are requests going to the right URL?
- Verify `VITE_API_URL` is set correctly on Vercel
- Make sure you redeployed Vercel after setting the env variable

### ❌ Render service is sleeping (free plan)
- Render free tier spins down after 15 minutes of inactivity
- First request after sleep takes ~30 seconds to wake up
- Upgrade to a paid plan or use [UptimeRobot](https://uptimerobot.com) to ping `/api/health` every 10 minutes to keep it awake

### ❌ Admin login gives 401
- Check that `ADMIN_USERNAME` and `ADMIN_PASSWORD` env vars are set on Render
- They default to `admin` / `pashuseva123` if not set

### ❌ React Router 404 on page refresh (Vercel)
- `vercel.json` in the frontend folder handles this with a rewrite rule
- Make sure `vercel.json` is committed and in `pashuseva/frontend/`

---

## Environment Variables Summary

### Render (Backend)
```
NODE_ENV=production
HOST=0.0.0.0
PORT=10000
CORS_ORIGIN=https://your-app.vercel.app
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your_secure_password
ADMIN_TOKEN=your_secure_token
JWT_SECRET=your_long_random_secret
JWT_EXPIRES_IN=7d
```

### Vercel (Frontend)
```
VITE_API_URL=https://your-app.onrender.com
```
