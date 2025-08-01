# Superfan Verified

## What it is
Superfan Verified lets music fans prove their loyalty using privacy-preserving verified streaming data. Fans earn badges, climb global leaderboards, and unlock exclusive artist rewards — all without exposing raw personal data.

## Why it matters
Fandom is real, but recognition is broken. Bots and inflated metrics dilute authenticity. This platform creates **verifiable fandom**: proof that’s private, shareable, and rewardable.

## Core features (MVP)
- zkTLS-powered verification of streaming history (Spotify / YouTube Music)  
- Digital fan badges (verifiable proof of status)  
- Global leaderboards per artist  
- Basic premium tier gating (e.g., “verified superfan” badge)

## Tech stack
- Verification: zkTLS via XION Developer Kit (Dave)  
- Mobile: React Native (or Flutter)  
- Data connectors: Spotify API, YouTube Music API (abstracted behind privacy layer)  
- Backend: Node.js / Python service for badge logic & leaderboard  
- Storage: Firebase or Appwrite for sessions/scores  
- Frontend/UI: TailwindCSS / shadcn/ui (for any web dashboard)  

## Getting started (dev placeholder)
1. Clone repo  
2. Copy `.env.example` to `.env` and set keys (Spotify client ID, YouTube API key, XION config)  
3. Run mock verification service: `cd backend && npm install && npm run dev`  
4. Launch mobile stub: `cd mobile && npm install && npm run start`  

## Project status
- [ ] Data connector mocks  
- [ ] zkTLS integration prototype  
- [ ] Badge issuance flow  
- [ ] Leaderboard backend  
- [ ] 60s pitch video assets  
- [ ] Landing page (Vercel)  

## Next steps
- Wire real music API data into zkTLS verification  
- Design and mint verifiable fan badges (on-chain or off-chain proof)  
- Build sharing/viral hooks (social share of badge + leaderboard snapshot)

## License
MIT
