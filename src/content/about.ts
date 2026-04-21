/**
 * Content model for the /about page.
 *
 * Everything the page needs lives here so the component stays a thin
 * renderer. Team roles and specialisms are plain strings so they're easy
 * to tweak without touching layout.
 */

import type { Accent } from "./work";

export type TeamMember = {
  name: string;
  role: string;
  /** Short one-liner, speciality or vibe. */
  bio: string;
  /** Optional headshot path, e.g. "/team/michael.jpg". Avatar shows
   *  initials if omitted. */
  photo?: string;
  /** Accent colour used for the initial disc, the hover border, and the
   *  small role eyebrow. Cycles through the site triad. */
  accent: Accent;
  /** Optional — year they joined the studio. */
  since?: string;
};

export type Principle = {
  num: string;
  heading: string;
  body: string;
  accent: Accent;
};

export const about = {
  founded: 2012,

  hero: {
    eyebrow: "[ About ] Webgro",
    heading: "Agency by name.",
    headingAccent: "Operators by trade.",
    lead:
      "We started Webgro because most eCommerce agencies either build pretty and ignore conversion, or build for conversion and ignore craft. We thought we could do both, shaped by actually running the businesses we serve.",
  },

  story: {
    eyebrow: "The studio",
    heading: "Fourteen years, one studio, same pair at the top.",
    body: [
      "Webgro was co-founded in 2012 by Michael and Lily Broadbridge. Same two people running it today, now with a small senior team and a vetted specialist network sitting behind them.",
      "We work hand-in-hand with clients as partners, not as the agency on the end of a monthly invoice. That framing comes from somewhere real: we've been the client as often as we've been the agency.",
    ],
  },

  /**
   * The distinctive claim: Webgro sits inside Broadbridge Group, which
   * owns real eCommerce and digital brands. Every recommendation we
   * make has been pressure-tested against our own P&L first.
   */
  broadbridge: {
    eyebrow: "Part of Broadbridge Group",
    heading: "We've sat on both sides of the brief.",
    body: [
      "Webgro is part of Broadbridge Group, which owns a stable of eCommerce and digital brands in its own right. Our team doesn't learn about running an online business from case studies or courses. We learn by doing, inside our own companies, every week.",
      "That shows up in the work. The scoping is sharper, the recommendations are more honest, the platform calls are grounded in what actually operates day-to-day. We'll tell you when a feature isn't worth the money because we've paid for the wrong features ourselves.",
    ],
  },

  /**
   * Team roster. Roles and bios are plausible defaults — swap freely.
   * Accent colour cycles blue / violet / teal to keep the avatar row
   * in the same palette as the rest of the site.
   */
  team: [
    {
      name: "Michael Broadbridge",
      role: "Co-Founder & CEO",
      bio: "Fifteen years on Shopify, WordPress, and the bits in between. Runs strategy, platform, and the AI workstream. Also owns four of the businesses we run inside Broadbridge Group.",
      photo: "/team/michael.jpg",
      accent: "blue",
      since: "2012",
    },
    {
      name: "Lily Broadbridge",
      role: "Co-Founder",
      bio: "Runs operations across the group. The person who keeps projects honest against timelines and budgets, and who you'll hear from most after go-live.",
      photo: "/team/lily.jpg",
      accent: "violet",
      since: "2012",
    },
    {
      name: "Matt",
      role: "Senior Developer",
      bio: "Lead developer on custom Shopify and WordPress builds. Under-the-bonnet type. If your site is fast and your CMS is a joy to use, Matt shipped it.",
      photo: "/team/matt.jpg",
      accent: "teal",
    },
    {
      name: "Kira",
      role: "Senior Designer",
      bio: "Identity, UI, and brand systems. Turns scoping docs into layouts that look finished long before the build catches up.",
      photo: "/team/kira.jpg",
      accent: "blue",
    },
    {
      name: "Macey",
      role: "Marketing & Social",
      bio: "Paid, lifecycle email, and social campaigns. Runs programs across both Webgro clients and the Broadbridge brands, so the playbooks compound in both directions.",
      photo: "/team/macey.jpg",
      accent: "violet",
    },
  ] satisfies TeamMember[],

  /**
   * "How we work" principles. Matches the tone of the service pages:
   * blunt, operational, skippable if you already know the vibe.
   */
  principles: [
    {
      num: "01",
      heading: "AI-assisted, not AI-automated",
      body:
        "Every AI system we build has a human-review gate. Autonomous AI fails in edge cases and erodes brand voice. We ship the throughput gains, not the quality loss.",
      accent: "teal",
    },
    {
      num: "02",
      heading: "Ships lean first",
      body:
        "No hero launches. Smallest version that proves the model works, live in weeks, then widened based on team feedback. Every AI tool in our portfolio started this way.",
      accent: "blue",
    },
    {
      num: "03",
      heading: "Measurable from week one",
      body:
        "If it can't prove value in week four, it doesn't ship. Every engagement has a clear ROI attribution path, and we'll tell you when one of our own recommendations isn't paying back.",
      accent: "violet",
    },
    {
      num: "04",
      heading: "Honest scoping",
      body:
        "No paid discovery, no surprise line items, no inflated retainer minimums. We scope against what you actually need. Sometimes that means saying we're the wrong fit.",
      accent: "teal",
    },
    {
      num: "05",
      heading: "One studio, the whole loop",
      body:
        "Strategy, design, build, SEO, marketing, AI. Same team across every capability. No agency-hopping, no hand-off gaps, no three account managers on one project.",
      accent: "blue",
    },
    {
      num: "06",
      heading: "Operators running an agency",
      body:
        "We own eCommerce brands inside Broadbridge Group. Every tactic we sell has been tried against our own P&L first.",
      accent: "violet",
    },
  ] satisfies Principle[],

  studio: {
    eyebrow: "The room",
    heading: "One studio. Bracknell. Full-time.",
    body: [
      "The whole team works out of our Bracknell studio. Same room, same hours, every day. It's how we keep the handoffs tight and the standard consistent, and how a designer can walk a question to a developer in thirty seconds rather than thirty messages.",
      "Clients come to us in Bracknell, hop on a call, or meet on-site wherever the project lives that week. Specialists in our wider network are the only part of the team that sits outside the studio, pulled in per project when scope calls for it.",
    ],
    address: "12 Longshot Lane, Bracknell, Berkshire, RG12 1RL",
  },

  awards: [
    { year: "2024", title: "Best Web Design Agency", region: "South East England", accent: "violet" as Accent },
    { year: "2024", title: "Best eCommerce Consultant", region: "South East England", accent: "teal" as Accent },
    { year: "2022", title: "Best Web Design Agency", region: "United Kingdom", accent: "blue" as Accent },
    { year: "2021", title: "Best Web Design Agency", region: "South East England", accent: "blue" as Accent },
    { year: "2020", title: "Best Web Design Agency", region: "Berkshire", accent: "blue" as Accent },
  ],

  cta: {
    heading: "Want the studio",
    headingAccent: "on your side?",
    body:
      "30 minutes, no decks, no pressure. We'll tell you straight if we're the right fit before anything else.",
  },
};
