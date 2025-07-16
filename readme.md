# Leventeen QR Bot

A fast, elegant Discord bot that generates **fancy QR codes** with logos, transparent backgrounds, custom colors, and boss-only no-prefix command control.

---

## ✨ Features

- ✅ `!qr <text>` – Generates QR codes in seconds
- 🎨 Fancy QR with transparent background & centered logo
- 👑 Boss-only no-prefix commands (optional via `.env`)
- 🔕 Replies don’t ping anyone (globally patched)
- 🧱 Modular command structure
- 🚀 Easy to extend with more commands like `ping`, `help`, etc.

---

## 📸 Example

```txt
!qr https://example.com
```

> Sends back a high-res QR code with a centered logo and custom style.

---

## 🚀 Setup Instructions

### 1. Clone & install

```bash
git clone https://github.com/yourusername/leventeen-qr-bot.git
cd leventeen-qr-bot
npm install
```

---

### 2. Add `.env` file

Create a `.env` in the root directory:

```env
DISCORD_TOKEN=your_discord_bot_token
BOSS_ID=your_discord_user_id
BOSS_MODE=true
```

---

### 3. Add your logo

Put your logo image at:

```
/assets/logo.png
```

> Recommended: use a square `.png` or `.jpg`. It will be auto-resized and centered in the QR.

---

### 4. Start the bot

```bash
node index.js
```

✅ Done! Your bot is now online and ready to scan.

---

## 🧪 Commands

| Command        | Who Can Use | Description                               |
|----------------|-------------|-------------------------------------------|
| `!qr <text>`   | Everyone    | Generates a QR code from the given input  |
| `qr <text>`    | Boss Only   | Same as `!qr`, but no prefix needed       |
| `!ping`        | Everyone    | Shows latency                             |
| `!help`        | Everyone    | (Optional) Add your own help command      |

---

## 🧱 Project Structure

```
leventeen-qr-bot/
├── commands/
│   ├── qr.js          # QR generation command
│   ├── ping.js        # Simple ping response
│   └── help.js        # (Optional) Help command
├── assets/
│   └── logo.png       # Your logo for QR overlay
├── .env               # Tokens and config
├── index.js           # Bot entry point
├── package.json
└── README.md
```

---

## 🧠 Built With

- [`discord.js`](https://discord.js.org) — Discord bot framework
- [`qrcode`](https://www.npmjs.com/package/qrcode) — Generate QR image buffers
- [`jimp`](https://www.npmjs.com/package/jimp) — Image processing & overlay

---

## 📃 License

MIT License — free to use, modify, and deploy.

---

## 💬 Author

Made with ❤️ by [Ayush](https://github.com/ayushedith)  
Got feedback? PRs and issues welcome.
