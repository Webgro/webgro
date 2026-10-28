# Scheduled Gro article: runbook

Each scheduled task (one per article, set up on 28 October 2026 from the
webgro.co.uk SEO strategy) gives you an article brief and tells you to follow
this file. Michael chose automatic publishing: write it, publish it, track it,
then email him the live link. Nobody reads it before it goes live, so the
checks below matter.

Repo: `~/Desktop/Claude/webgro-site` (Next.js, deployed to Vercel project
`webgro`). Read `AGENTS.md` there first.

## Hard rules

- No em dashes anywhere (U+2014): copy, alt text, commit messages. En dashes
  only in number ranges (£4k–15k). The house voice is plain, blunt and direct.
- Only facts that are already on the site. Prices, timelines and results come
  from `src/components/preview/services/content.ts`, the care plans content
  under `src/components/preview/care/`, `src/content/work.ts` (case studies)
  and `src/components/preview/seo.ts`. Never invent a client, figure or quote.
- Never call Fun Cases, Sublishop or ANYPRINT sister or group companies.
- Never add a line saying the article was written with AI.
- Never print or log `GEMINI_API_KEY`.
- Commit only the files you created or changed. Other sessions may have
  uncommitted work in this checkout: leave it alone.

## 1. Check the repo

```bash
cd ~/Desktop/Claude/webgro-site && git switch main && git status --short && git log --oneline -5
```

If `src/content/the-gro.ts` or `next.config.ts` has uncommitted changes that
aren't yours, stop and email Michael (step 9) instead of publishing.

## 2. Write the article

Read the brief, the two most recent articles in `src/content/the-gro.ts`
(including "How much does a website cost in the UK?", the model to follow) and
the service page the brief links to.

- 1,000 to 1,400 words. Open with a paragraph that sets up the question, then
  a `callout` giving the short answer. `h2` sections, `h3` where useful, lists
  for comparisons. End with a short paragraph pointing to the service page and
  `[get in touch](/contact)`.
- Links are markdown in the text: `[Shopify websites](/services/websites/shopify)`.
  Link the brief's service page at least twice, plus one or two related pages.
- Be fair to the alternatives. Say when we're not the right answer.
- Fields: `slug` from the brief, `category` from the brief, `title` as a
  sentence ending in a question mark or full stop, `excerpt` of one or two
  sentences, `date` as the publish month ("Nov 2026"), `readTime` at about
  200 words a minute ("6 min read"), `accent` from the brief, `author:
  "Michael Broadbridge"`, `heroImage: "/articles/<slug>.jpg"`,
  `relatedService` from the brief.
- Insert it as the FIRST element of the `articles` array.

## 3. Take over the old URL (if the brief names one)

In `next.config.ts`, remove the old path from the `blogPosts` list and add,
under "Old posts whose topic has a new article" in `specificPosts`:

```ts
r("/<old-slug>", "/the-gro/<new-slug>"),
```

## 4. Make the images

```bash
cd ~/Desktop/Claude/webgro-site && zsh -c 'source ~/.zshenv; SSL_CERT_FILE=/etc/ssl/cert.pem python3 scripts/gemini-image.py --slug "$1" --prompt "$2"' _ "<slug>" "<prompt>"
python3 scripts/generate-feed-image.py --slug "<slug>" --title "<title>" --accent <accent>
```

Image prompt: editorial still-life product photography of one object that
makes the article's point (the brief suggests one), on a seamless two-tone
studio set, single hard key light from the upper left with a crisp shadow,
straight-on camera, generous negative space, minimal and colour-blocked,
wide 16:9. Name the palette: dark ink, electric blue (#2D8DFF), violet
(#7C3AED), mint teal (#00C9A7), cream (#F4F6FB), with the article's accent
colour dominant. Say "No text, no logos, no people."

Look at `public/articles/<slug>.jpg` before going on. If it has text,
people, a logo or a clash with the palette, run it again (up to three
times). If it still fails, use the best one and say so in the email.

## 5. Check

```bash
cd ~/Desktop/Claude/webgro-site && grep -c "—" src/content/the-gro.ts next.config.ts
```

Both must be 0.

## 6. Commit, push and deploy

```bash
cd ~/Desktop/Claude/webgro-site && git add src/content/the-gro.ts next.config.ts public/articles/<slug>.jpg public/articles/feed/<slug>.jpg && git commit -m "Gro: <title>" && git push origin main
rm -rf /tmp/wg-deploy; git worktree prune; git worktree add -q --detach /tmp/wg-deploy HEAD && vercel deploy --prod --yes --project webgro --cwd /tmp/wg-deploy
```

End the commit message with:
`Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`

If the build fails, fix it if the cause is in your article. Otherwise revert
your commit, push, and email Michael with the error.

## 7. Verify live

```bash
curl -s -o /dev/null -w "%{http_code}\n" https://webgro.co.uk/the-gro/<slug>
curl -s -o /dev/null -w "%{http_code} %{redirect_url}\n" https://webgro.co.uk/<old-slug>
curl -s https://webgro.co.uk/the-gro/feed.xml | grep -c "<slug>"
```

The new alias can take a minute: retry a few times before deciding it failed.

## 8. Track it in the portal

Use Claude in Chrome (Michael is signed in to portal.webgro.co.uk). The
webgro.co.uk SEO page is
`https://portal.webgro.co.uk/admin/rankings/473d4a9a-f844-4adf-9270-9ebef5d71272`.

1. On `?tab=find`, paste the brief's keywords into "Add your own", one per
   line, and click Add.
2. On the Work tab, open "Log a change". Title `New Gro article: <title>`,
   page = the live URL, the same keywords, and a note naming the old URL it
   took over. Click "Log it" ONCE and wait up to 30 seconds for "Logged". It
   can be slow: do not submit again, or it logs twice.

## 9. Email Michael

Gmail, to hello@webgro.co.uk. Subject `New on The Gro: <title>`. Body: the
live link, the keywords now tracked, the old URL it took over, and anything
that went wrong or needs a look. Keep it short and plain.
