/**
 * Google reviews for Webgro, copied word for word from the Google Business
 * Profile on 22 September 2026 (5.0 from 14 reviews). Don't edit the text of a
 * review. If one needs shortening, cut at a sentence boundary and keep the
 * words that remain exactly as written.
 *
 * Google doesn't show review stars in search for a business's reviews of
 * itself, so these are not marked up as AggregateRating or Review schema.
 */
export const GOOGLE_RATING = { score: "5.0", count: 14 };
export const GOOGLE_PROFILE_URL = "https://maps.google.com/?cid=10237799358321821754";

export type Review = {
  name: string;
  /** Approximate year, worked out from Google's "2 years ago" style dates. Not shown on the site. */
  when: string;
  text: string;
  /** Shown on the site. The rest are kept for reference. */
  featured?: boolean;
};

export const reviews: Review[] = [
  {
    name: "Ryan",
    when: "2024",
    text: "We reached out to several Web Development/Design agencies to help us with our new website and marketing material. Webgro were by far the most engaging, came up with some great ideas and very competitive on price. Thanks to Michael & the team. Would highly recommend!",
    featured: true,
  },
  {
    name: "Steven Hibbert",
    when: "2023",
    text: "Friendly, attentive and always ready to help (even on short notice). Really enjoy working with Michael and Webgro in general. Well worth chatting to them to see if they can help you too!",
    featured: true,
  },
  {
    name: "James Kibble",
    when: "2023",
    text: "Have worked with Michael and his company for my website, branding and designs since the beginning of my business. They have always gone above and beyond and put up with my constantly developing and changing vision! Couldn't recommend them enough.",
    featured: true,
  },
  {
    name: "Bradley Ashton",
    when: "2023",
    text: "Michael and the team set up an efficient, well oiled website that has boosted our presence online and continue to support us with any changes we wish to make in rapid time.",
    featured: true,
  },
  {
    name: "Victoria Short",
    when: "2023",
    text: "Michael Broadbridge and his team are so responsive, explain everything clearly and are generally very helpful. I used them to create my website and I would definitely recommend.",
    featured: true,
  },
  {
    name: "Joey Mattress",
    when: "2019",
    text: "Exceptional service from Michael and his team. They are professional, brilliant, fast and patient with all of our requests! We fully recommend Broadbridge Design for any businesses looking to build an ecommerce site. Definitely would give more stars if we could!",
  },
  {
    name: "Issie Gilbert",
    when: "2023",
    text: "Very impressed with Webgro and enjoyed working with the team. Michael was always helpful and continuously providing me with his assistance throughout our multiple projects.",
  },
  {
    name: "Wesley Nichols",
    when: "2025",
    text: "The service is 5 stars and I genuinely cannot fault them.",
  },
  {
    name: "Mel's Motors Ltd",
    when: "2018",
    text: "I have received excellent service from Broadbridge Design. Michael created my website and offers ongoing support, I really feel like a valued customer, quick responses to emails and phone calls.",
  },
  {
    name: "StarStruck15",
    when: "2018",
    text: "Amazing knowledge from the team and really helped me build upon my existing website. Really transformed our ecom platform!",
  },
  {
    name: "Toni Edney",
    when: "2018",
    text: "5 stars. Very professional and affordable.",
  },
  {
    name: "Jamie McGill",
    when: "2018",
    text: "Been working with Michael for a few years now which has included designing my company logo and our website.",
  },
];
