# Copy rules for the Webgro concept

The client reads a lot of AI-written copy and can spot it straight away. The first round of copy on this
concept failed that test. Lines he flagged:

- "Twelve projects we're proud of."
- "Start with the problem. We'll point you to the right service."
- "All six, laid out on the desk."

He also questioned the invented customer quotes ("We need a new website, or the one we've got is holding us
back.") used across the services pages.

The fix is plain, specific writing. It is fine for copy to be a little ordinary. Ordinary and specific reads as
a real business. Clever and rhythmic reads as a machine.

## What makes copy read as AI (remove all of these)

1. **Clever headlines.** Aphorisms, puns, metaphors, and headings that narrate the page's own design or
   animation. "All six, laid out on the desk." "Back on the drawing board." "We've sat on both sides of the
   brief." "Agency by name. Operators by trade."
2. **Two-beat and balanced constructions.** "Start with X. We'll do Y." "X, not Y." "We'd rather X than Y."
   "As often as." "Not just X, but Y." "Whether you X or Y." Two short sentences that mirror each other.
3. **Performed honesty, modesty or humour.** "honestly", "we'll tell you straight", "no pressure", "no slide
   deck", "it still catches us off guard", "we were busy", "the kettle's usually on", "if we're not the right
   fit we'll say so".
4. **Swipes at other agencies.** "most agencies", "juniors learning on your budget", "bloated themes", "no
   templated components", "unlike".
5. **Invented quotations** or first-person "voice of the customer" lines, in or out of quotation marks. No
   quotation marks anywhere unless it is a real, attributed quote that already exists in `src/content/`.
6. **Epigram endings.** Sentences built to land a neat moral: "...is the one doing the work.", "...which was
   the point.", "...and that's deliberate.", "...earned out on day one."
7. **Personification and cute verbs.** Software that "knows", "reads", "fetches a human", "stays out of the
   way"; apps that "made way for"; a site that "earns its keep".
8. **Filler words.** actually, genuinely, really, truly, simply, just, properly, a good deal, quietly,
   seamlessly, effortlessly, crafted, journey, elevate, unlock, empower, supercharge, leverage, robust.
9. **Talking about the reader or the page.** "Most people come to us with...", "You don't need to know what any
   of these is called", "Scroll down to find...", "Pick the one that sounds most like you".
10. **Rhythm lists.** Groups of three used for cadence rather than because there are three things.
11. **Dramatic set-ups and fragments.** "Here's the thing.", "That's it.", "The result?", "Two months, head
   down.", "No spikes. No hero launches."
12. **Em dashes** (never), and semicolons used for effect.

## What to write instead

- **Headings label the section or state a plain fact.** "Our work", "Services", "Websites", "How a project
  works", "Recent work", "Questions", "Awards", "The team", "Get in touch". A page H1 can say plainly what the
  page offers: "Shopify and WordPress websites", "Email marketing".
- **Body copy says what we do, for whom, and the specifics.** Concrete nouns, platform names, numbers, time
  frames. Plain verbs: build, design, set up, move, fix, run, manage, report.
- **One idea per sentence.** Mostly 12 to 25 words, varied naturally. Don't chain three clauses for effect.
- **British English.** Contractions where they'd naturally be said, not forced into every sentence.
- **Links and buttons say where they go.** "Read the case study", "View all work", "See the service",
  "Get in touch", "Send enquiry".
- **Keep every fact exactly.** Numbers, names, dates, prices and platforms stay as they are. Never add a fact,
  result, client, guarantee, price or claim that isn't already in `src/content/*.ts` or the existing copy.
  If a sentence only works with an invented fact, cut the sentence.
- **Cut rather than decorate.** If a line only adds tone, delete it. Shorter pages are fine.

## Before and after

| Before | After |
| --- | --- |
| Twelve projects we're proud of. | Our work |
| Start with the problem. We'll point you to the right service. | Services |
| All six, laid out on the desk. | (delete, or) What we offer |
| We've sat on both sides of the brief. | (delete) |
| Tell us what is not working, and we will tell you honestly whether we can fix it. | Tell us about your project. |
| Whoever answers your email is the one doing the work. | It's a small team, so you'll deal directly with the people designing and building your site. |
| A support assistant that knows when to fetch a human. | AI customer support for Twisted Tailor |
| "Our team loses hours every week to jobs software should be doing." | Automating repetitive work your team does by hand |
| Third-party apps made way for native theme code. | We replaced the third-party apps with custom theme code. |
| It's a short list. We were busy. | (delete) |

## Mechanics

- Only change user-facing strings: headings, body, labels, captions, buttons, alt text, aria labels,
  metadata titles and descriptions. Don't change data structure, keys, slugs, routes, class names or logic.
- Some copy is referenced elsewhere: a brush-underlined phrase (`brush`, `HIGHLIGHT`, `pv-brushed`) must still
  exist, word for word, in the line it underlines. Line-split headings (arrays of lines, `pv-line`) must still
  have sensible line breaks. If you shorten a heading from three lines to one, adjust the array or markup.
- Grep your files for quotation marks (`&ldquo;`, `&rdquo;`, `“`, `”`) and em dashes before you finish.
- Run `npx tsc --noEmit -p .` and `npx eslint <your files>`. Do not start a dev server or open a browser.
