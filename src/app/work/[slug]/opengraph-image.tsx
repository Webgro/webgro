import { ImageResponse } from "next/og";
import { caseStudies } from "@/content/work";

/**
 * Per-case-study OG image. Composites the case's hero image (or a
 * gradient fallback if the hero isn't set) with the client name and
 * tag, at the 1200x630 Open Graph standard.
 *
 * Case studies use `heroImage` paths like "/work/fun-cases.png" which
 * map to the public folder. In the OG handler we read the file straight
 * off the repo's `public/` directory so nothing has to be fetched over
 * the network during image generation.
 */
export const alt = "Webgro case study";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Pre-generate for every known slug at build time.
export function generateImageMetadata() {
  return caseStudies.map((c) => ({ id: c.slug }));
}

export default async function WorkOg({ params }: { params: { slug: string } }) {
  const c = caseStudies.find((x) => x.slug === params.slug);
  if (!c) {
    // Falls back to the site-wide default OG if slug is unknown.
    return new ImageResponse(<div />, size);
  }

  const accentHex: Record<typeof c.accent, string> = {
    blue: "#2D8DFF",
    violet: "#7C3AED",
    teal: "#00C9A7",
  };
  const accent = accentHex[c.accent];

  // Next 16's ImageResponse runs on the edge, which can't read local
  // files directly. Using an absolute URL lets it fetch the image from
  // the same deployment origin. `VERCEL_URL` is injected automatically
  // on Vercel; fall back to a reasonable production URL elsewhere.
  const origin =
    process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "https://webgro.co.uk";
  const heroUrl = c.heroImage ? `${origin}${c.heroImage}` : null;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#07080C",
          position: "relative",
        }}
      >
        {/* Left half: hero imagery */}
        <div
          style={{
            flex: 1,
            position: "relative",
            display: "flex",
            background: `linear-gradient(135deg, ${accent}44 0%, #0D1117 60%, #07080C 100%)`,
          }}
        >
          {heroUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={heroUrl}
              alt=""
              width={600}
              height={630}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center",
              }}
            />
          )}
          {/* Darkening gradient so left-side text is always legible */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(90deg, rgba(7,8,12,0.35) 0%, rgba(7,8,12,0.9) 100%)",
            }}
          />
        </div>

        {/* Right half: caption */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: 64,
            color: "#EDEFF4",
            fontFamily: "Inter, sans-serif",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
            }}
          >
            <div
              style={{
                height: 10,
                width: 10,
                borderRadius: 999,
                background: accent,
              }}
            />
            <div
              style={{
                fontSize: 18,
                letterSpacing: 5,
                textTransform: "uppercase",
                color: "#9AA6BC",
                fontFamily: "monospace",
              }}
            >
              [ Case study · {c.year} ]
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
            <div
              style={{
                fontSize: 74,
                fontWeight: 800,
                lineHeight: 1,
                letterSpacing: -1.5,
              }}
            >
              {c.client}
            </div>
            <div
              style={{
                fontSize: 24,
                lineHeight: 1.4,
                color: "#9AA6BC",
                maxWidth: 520,
              }}
            >
              {c.excerpt}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              paddingTop: 24,
              borderTop: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <div
              style={{
                fontSize: 36,
                fontWeight: 800,
                letterSpacing: -0.5,
              }}
            >
              Webgro
            </div>
            <div
              style={{
                fontSize: 16,
                letterSpacing: 4,
                textTransform: "uppercase",
                color: "#6B7A99",
                fontFamily: "monospace",
              }}
            >
              webgro.co.uk/work
            </div>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
