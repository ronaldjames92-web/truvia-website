# Truvia Consultants Website — Project Context

## Deployment (READ THIS FIRST)
- Live site: truviaconsultants.com and www.truviaconsultants.com
- Deployment: GitHub → Cloudflare Pages auto-deploy
- Repo: ronaldjames92-web/truvia-website, branch: main
- Cloudflare Pages watches this repo directly and rebuilds automatically 
  within ~1 minute of every push to main
- NO FTP, NO Hostinger hosting, NO GitHub Actions, NO manual file upload
- This setup is final and working — do not suggest reverting to FTP/Hostinger 
  Builder/GitHub Actions as deployment methods

## Domain & DNS
- Domain registrar: Hostinger (registration only)
- DNS management: Cloudflare (fully migrated, nameservers point to Cloudflare)
- Email (info@truviaconsultants.com etc.) runs on separate MX/TXT records 
  — NEVER modify DNS email records when making website changes
- SSL: active and auto-managed by Cloudflare on both domains

## Forms & Integrations
- Contact form uses Web3Forms (web3forms.com) to deliver leads
- Submissions go to: info@truviaconsultants.com
- Web3Forms access key: check Web3Forms dashboard (Form Setup tab) if needed — 
  do not hardcode or expose the key in chat/commits beyond what's already in index.html

## Workflow Preference
- Always show the diff/changes and explain what will change BEFORE pushing to main
- Wait for explicit approval ("push it" or similar) before pushing
- After pushing, confirm Cloudflare Pages deployment status if possible

## Business Context
- Immigration consultancy based in Kuwait, serving Gulf/GCC-based expat clients
- Specializes in Australia skilled migration, Canada Express Entry, New Zealand 
  pathways, and English exam coaching (PTE, IELTS, OET)

## Known Design/Layout Notes
- "Why Choose Truvia" section has a MARA Registered Agent credential card 
  (left column) — previously had a mobile sticky-positioning bug (fixed: 
  disabled position:sticky on screens ≤860px so it doesn't overlap the 
  numbered list when scrolling on phones)
- Mobile responsiveness: verify changes on mobile width, this site has had 
  mobile-specific layout bugs before
