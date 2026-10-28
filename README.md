# Icon AI – Free WhatsApp AI Bot

Beautiful web interface to link your WhatsApp number.  
No Telegram. No paid hosting required.

**Features once linked:**
- `.ai` / `.Ai` – Chat with Icon AI (powered by Grok API)
- `.play` – Search & play music
- `.image` / `.imagine` – Generate images
- `.menu` – Command list
- **View-once remover** – automatically unlocks view-once photos/videos/voice notes
- **Anti-delete** – recovers deleted messages
- Auto sets bio to **Icon Ai Bot**
- Auto sets profile picture (if you configure one)

---

## Quick Start (Local)

```bash
git clone https://github.com/YOUR_USERNAME/icon-ai.git
cd icon-ai
npm install
cp .env.example .env
# Edit .env and add your XAI_API_KEY
npm start
```

Open → http://localhost:3000

---

## Free Hosting on GitHub + Render (Recommended)

Pure GitHub cannot keep a WhatsApp bot running 24/7 for free.  
The best **100% free** method that uses your GitHub repo is **Render.com**.

### Step-by-step

1. **Create a GitHub repository**
   - Go to github.com → New repository
   - Name it `icon-ai` (or anything)
   - Upload all the files from this project

2. **Sign up on Render** (free)
   - Go to [https://render.com](https://render.com)
   - Sign up with your GitHub account

3. **Create a Web Service**
   - Click **New +** → **Web Service**
   - Connect the `icon-ai` repository
   - Settings:
     - **Name**: `icon-ai` (or any name)
     - **Runtime**: Node
     - **Build Command**: `npm install`
     - **Start Command**: `npm start`
     - **Instance Type**: Free

4. **Add Environment Variables** (in Render dashboard)
   ```
   XAI_API_KEY = your_xai_key_here
   PROFILE_PICTURE_URL = https://your-image-url.webp   (optional)
   AI_STATUS_TEXT = Icon Ai Bot
   ```

5. Click **Create Web Service**

Render will give you a free URL like:
```
https://icon-ai-xxxx.onrender.com
```

Open that URL → people can now pair their WhatsApp from the website!

> **Note about free plan**: Render free services sleep after 15 minutes of inactivity.  
> The first request after sleep takes ~30–50 seconds to wake up. After that it works normally.  
> For always-on you can later upgrade or use a free uptime monitor (UptimeRobot) that pings `/health` every 5–10 minutes.

---

## How pairing works

1. User opens your website
2. Enters phone number with country code (e.g. `2348012345678`)
3. Clicks **Get Pairing Code**
4. Receives an 8-character code
5. On phone: **WhatsApp → Linked devices → Link a device → Link with phone number**
6. Enters the code

Once linked:
- Bio changes to **Icon Ai Bot**
- Profile picture updates (if set)
- All commands become active

---

## Commands (after pairing)

| Command              | Description                     |
|----------------------|---------------------------------|
| `.menu`              | Show menu                       |
| `.ai` / `.Ai`        | Chat with Icon AI               |
| `.play <song>`       | Search music                    |
| `.image` / `.imagine`| Generate image from text        |

Automatic:
- View-once media → unlocked
- Deleted messages → recovered

---

## Environment Variables

| Variable              | Required | Description                                      |
|-----------------------|----------|--------------------------------------------------|
| `XAI_API_KEY`         | Yes*     | From https://console.x.ai (needed for `.ai`)     |
| `PROFILE_PICTURE_URL` | No       | Direct image URL for WhatsApp profile picture    |
| `AI_STATUS_TEXT`      | No       | Bio text (default: `Icon Ai Bot`)                |
| `PORT`                | No       | Port (hosts set this automatically)              |

\* Without `XAI_API_KEY` the `.ai` command will not work. Everything else still works.

---

## Project Structure

```
icon-ai/
├── server.js           # Express server + API
├── lib/
│   └── whatsapp.js     # Baileys + AI features
├── public/
│   ├── index.html      # Pairing website
│   ├── style.css
│   └── script.js
├── package.json
├── .env.example
└── README.md
```

---

## Tips

- Sessions are saved in the `sessions/` folder (persists across restarts on Render if you use a persistent disk, or re-pair after free-tier cold starts).
- To force re-pair a number, delete its folder inside `sessions/`.
- Keep your `XAI_API_KEY` private – never commit the real `.env` file.

Enjoy your free Icon AI bot!
