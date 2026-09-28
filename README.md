# F.T.T.U Marketing Agent

The founder's private tool for getting F.T.T.U seen and sold. It is separate from the F.T.T.U showroom site and from the manufacturing agent, and does one job: marketing. Making the product is the manufacturing agent's job.

It places every F.T.T.U product on one ladder — **Concept → Tested → Waitlist → Pre-selling → Selling** — so you can see exactly where each one stands, then looks at it three ways and answers the five W's — who, what, when, where, why — plus the money for each:

1. **Organic** — build the audience yourself. LinkedIn, Instagram, TikTok and a free email list. Nothing up front. Proves who wants which product.
2. **Pre-sell** — take real orders before anything is made, on Kickstarter or through Printful and Zellerfeld, which make each item after it sells. Needs one real sample first. Proves people will pay.
3. **Paid** — pay Meta or TikTok to show a post that already worked to new people, or send product to creators. Costs a budget. Proves which message works.

## The two pages

- **`index.html` — the agent.** Tell it which product you want out in the world. It asks one question if it needs to, then shows where the product stands, recommends a way, links the channel, estimates how ready you are to launch, and gives one next step. It writes posts, captions and emails with a copy button. Four cards: the chat, the top match, the shortlist (readiness gauge plus all three ways — tap one to see its 5 W's), and the details (the ladder, three posts to make, rules that apply, next step).
- **`guide.html` — the playbook.** The same information to read yourself: where every product stands, the three ways side by side, every product through all three, each product's story and post ideas, who can help you get seen, the path in order, the rules and five official sources to read.

## Files

```
fttu-marketing-agent/
├── index.html          The agent
├── guide.html          The playbook
├── api/
│   └── chat.js         Vercel serverless function — holds your Anthropic API key, calls Claude
├── assets/
│   └── engine-bg.jpg   Agent background
├── css/
│   ├── agent.css       Agent styles
│   ├── guide.css       Playbook styles
│   └── lightbox.css    Full-screen image viewer
└── js/
    ├── data.js         THE data: the ladder, three ways, channels, products, rules, path, reading list
    ├── catalog.js      The F.T.T.U designs and image links (copied from the showroom repo)
    ├── agent.js        Agent behavior
    ├── guide.js        Playbook behavior
    └── lightbox.js     Full-screen image viewer
```

## Putting it online (Vercel)

1. Create a new GitHub repository named `fttu-marketing-agent` and add these files.
2. In Vercel, import that repository as a **new project** (separate from the showroom and the manufacturing agent).
3. In the project's **Settings → Environment Variables**, add `ANTHROPIC_API_KEY` with your key. Production only is fine.
4. Redeploy. The agent answers once the key is set.

The playbook works anywhere, even opened straight from your computer. The agent's chat needs the Vercel backend; opened from your computer it explains that instead of answering.

## Moving a product up the ladder

Every product starts at **Concept** in `js/data.js` (the `stage` field). When a product earns a rung — people outside your circle have seen it cold, signed up, or paid — change its `stage` to `tested`, `waitlist`, `presale` or `selling`, and update its `signal` line with the real number. Both pages and the agent pick it up. You can also just tell the agent in chat ("40 people signed up for the flip-flops"); it plans from the new rung for that conversation.

## Keeping it honest

Every channel in `js/data.js` has a `checked` line (what was confirmed, September 2026) and a `caveat` line (what wasn't). Keep both honest when you edit. The agent only knows what's in `data.js` and `catalog.js`.

The only confirmed dollar figures are Kickstarter's fees (5% of a funded campaign plus 3–5% payment processing, nothing if the goal is missed), Kit's free plan (up to 10,000 subscribers, from pricing reviews) and Meta's reported starting guidance (about $5 a day for six or more days). The agent is told never to invent follower counts, prices or results, and every draft it writes calls the designs concepts.

The only real demand in the data is the founder's own count of five people asking for the track jacket. The jacket photos of family and friends are AI edits of real people; the playbook flags that they need each person's written permission and an AI label before any public use, and neither page shows them.

Images load from the F.T.T.U Supabase bucket, including the `breakdowns/` folder of exploded views. Every image is an AI concept render.

The backend uses the `claude-sonnet-5` model.
