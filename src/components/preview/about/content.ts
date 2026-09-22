/**
 * Copy for the About page concept. Every fact here comes from
 * src/content/about.ts or the homepage concept. Only the wording is new.
 */

export const FOUNDED = 2012;
/** Bump this together with the "14" years figure in the hero facts below. */
export const NOW_YEAR = 2026;

export const hero = {
  kicker: "About Webgro",
  lede:
    "We build Shopify and WordPress websites, and we also handle SEO, marketing and AI tools.",
  facts: [
    { figure: "2012", label: "The year Michael and Lily started the business" },
    { figure: "14", label: "Years in business" },
    { figure: "5", label: "Awards since 2020" },
    { figure: "4", label: "Senior people in the team, plus a specialist network" },
  ],
};

export const story = {
  label: "The studio",
  headingLines: ["Michael and Lily", "still run Webgro."],
  headingLinesNarrow: ["Michael and", "Lily still run", "Webgro."],
  body: [
    "They started the business together in 2012 as 4ogo. It became Broadbridge Design in 2015 and has been Webgro since 2022.",
    "Alongside them there's a small senior team in the office, and a network of specialists we bring in for particular jobs.",
  ],
};

export type Milestone = {
  /** Year the big counter lands on while this card is showing. */
  year: number;
  /** Label shown beside the card in the static layout. */
  yearLabel: string;
  title: string;
  body: string;
};

export const milestones: Milestone[] = [
  {
    year: 2012,
    yearLabel: "2012",
    title: "Michael and Lily start 4ogo.",
    body: "The business starts as a two-person studio building websites.",
  },
  {
    year: 2015,
    yearLabel: "2015",
    title: "4ogo becomes Broadbridge Design.",
    body: "Michael and Lily rename the business Broadbridge Design.",
  },
  {
    year: 2020,
    yearLabel: "2020",
    title: "Best Web Design Agency in Berkshire.",
    body: "Our first award, for Berkshire, where the studio is based.",
  },
  {
    year: 2021,
    yearLabel: "2021",
    title: "Best Web Design Agency in South East England.",
    body: "The same award, this time for the whole of South East England.",
  },
  {
    year: 2022,
    yearLabel: "2022",
    title: "Broadbridge Design becomes Webgro.",
    body: "The business has been called Webgro ever since.",
  },
  {
    year: 2022,
    yearLabel: "2022",
    title: "Best Web Design Agency in the United Kingdom.",
    body: "The same award at national level.",
  },
  {
    year: 2024,
    yearLabel: "2024",
    title: "Best Web Design Agency and Best eCommerce Consultant, South East England.",
    body: "Two awards in one year. Best eCommerce Consultant was our first award outside web design.",
  },
  {
    year: NOW_YEAR,
    yearLabel: "Today",
    title: "Webgro today.",
    body: "Michael and Lily still run the studio, with a small senior team and a network of specialists. We've launched a little over a hundred websites so far.",
  },
];

export type Person = {
  name: string;
  role: string;
  bio: string;
  /** Optional portrait. Without one the row becomes a full-width type card. */
  photo?: string;
  photoSize?: number;
};

export const teamIntro = {
  heading: "The team",
  lede: "It's a small team, so you'll deal directly with the people designing and building your site.",
};

export const team: Person[] = [
  {
    name: "Kira",
    role: "Senior designer",
    bio: "Kira works on brand identity, interface design and brand systems.",
    photo: "/preview/team-kira.jpg",
    photoSize: 800,
  },
  {
    name: "Matt",
    role: "Senior developer",
    bio: "Matt leads our custom Shopify and WordPress builds.",
    photo: "/preview/team-matt.jpg",
    photoSize: 800,
  },
  {
    name: "Lily",
    role: "Co-founder, here since 2012",
    bio: "Lily runs operations, including project timelines and budgets. She is the main contact for clients after launch.",
    photo: "/preview/team-lily.jpg",
    photoSize: 480,
  },
  {
    name: "Michael",
    role: "Co-founder and CEO, here since 2012",
    bio: "Michael looks after strategy, platform choices and our AI work.",
    photo: "/preview/team-michael.jpg",
    photoSize: 480,
  },
];

export const network = {
  label: "Specialist network",
  specialists: [
    "Paid-media buyers",
    "logistics consultants",
    "B2B strategists",
    "luxury brand designers",
    "platform migration specialists",
  ],
  body: "When a project needs skills we don't have in-house, we bring in a senior specialist from this network. You keep one point of contact at Webgro, and we coordinate the specialist's work.",
};

export const room = {
  label: "Our office",
  headingLines: ["Everyone works", "from one office", "in Bracknell."],
  body: [
    "The whole team works from our Bracknell office, in the same room and on the same hours. The only people based elsewhere are the specialists we bring in for particular projects.",
    "You can visit us in Bracknell or talk to us on a call, and we can also meet you on-site.",
  ],
  sketch: {
    walk: { title: "Asking across the room", time: "In person" },
    type: { title: "Asking by message", time: "Email or chat" },
    from: "Design",
    to: "Development",
  },
  addressLabel: "Head office",
  address: ["12 Longshot Lane", "Bracknell, Berkshire", "RG12 1RL"],
};
