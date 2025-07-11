 # Vortex AI Chat
 <img width="48" height="48" alt="image" src="https://github.com/user-attachments/assets/058de5d4-6981-4193-a0a8-cf1a0327b8b0" />

> A lightning-fast, Gemini-powered chat UI with a sleek design, multimodal intelligence, and edge-first deployment. Built for speed, elegance, and extensibility.

# The main screen 
<img width="1280" height="933" alt="pc-screenshot-3" src="https://github.com/user-attachments/assets/d03d4b81-965c-4c36-93ee-36503b3ce355" />



# more plugins are  comming soon but at this time this is the plguin page
<img width="1278" height="939" alt="pc-screenshot-2" src="https://github.com/user-attachments/assets/974cc047-42db-40bc-a088-56be04299eb6" />

# how it can discribe images
<img width="1262" height="934" alt="pc-screenshot-1 png" src="https://github.com/user-attachments/assets/e2c84dd6-0114-4d92-97fa-f1306f29f138" />

---

## ⚡ Why Vortex?

- ✨ **Modern UI** – Streamlined Next.js app with beautiful dark/light mode switching.
- 🔮 **Gemini 1.5 Pro/Flash/Vision** – Talk, see, and reason with state-of-the-art multimodal LLMs.
- 🧠 **Streaming Chat** – Real-time token rendering with zero cold starts.
- 🔌 **Plugin-Ready** – Web search, weather, PDF reader, ArXiv summaries & more.
- 🖼️ **Vision Upload** – Drag-n-drop images and query Gemini Vision instantly.
- 🔊 **Voice In/Out** – Whisper + Gemini text-to-speech built in.
- 🌐 **PWA** – Installable as a native-like app with menu bar support.
- 🧾 **Local-first** – Your history stays with you; no cloud vendor lock-in.

---

## 🧰 Tech Stack

- [Next.js 14](https://nextjs.org)
- [Tailwind CSS](https://tailwindcss.com)
- [Gemini 1.5 API (Pro, Flash, Vision)](https://ai.google.dev/)
- [LangGraph](https://www.langchain.com/langgraph) for plugin flows
- [Vercel Edge Functions](https://vercel.com/features/edge-functions)
- [Cloudflare Pages/Workers](https://pages.cloudflare.com/) support

---

## 🚀 Live Demo

👉 [https://vortexaichat.netlify.app/](https://vortexaichat.netlify.app/)

---

## 📦 Local Setup

```bash
git clone https://github.com/vortex-ai-chat/vortext-ai-chat.git
cd vortext-ai-chat
cp .env.example .env.local # Add your Gemini API Key
pnpm install
pnpm dev
