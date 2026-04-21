import { ImageResponse } from "next/og";
import { articles } from "@/content/the-gro";

/**
 * Per-article OG image. Uses the article hero as the left panel and
 * the article title/category on the right, matching the case-study OG
 * treatment so /work and /the-gro share a visual family when shared.
 */
export const alt = "Webgro · The Gro article";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateImageMetadata() {
  return articles.map((a) => ({ id: a.slug }));
}

export default async function ArticleOg({
  params,
}: {
  params: { slug: string };
}) {
  const a = articles.find((x) => x.slug === params.slug);
  if (!a) {
    return new ImageResponse(<div />, size);
  }

  const accentHex: Record<typeof a.accent, string> = {
    blue: "#2D8DFF",
    violet: "#7C3AED",
    teal: "#00C9A7",
  };
  const accent = accentHex[a.accent];

  const origin = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "https://webgro.co.uk";
  const heroUrl = a.heroImage ? `${origin}${a.heroImage}` : null;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#07080C",
        }}
      >
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
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(90deg, rgba(7,8,12,0.3) 0%, rgba(7,8,12,0.88) 100%)",
            }}
          />
        </div>

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
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
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
              [ The Gro · {a.category} ]
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
            <div
              style={{
                fontSize: 56,
                fontWeight: 800,
                lineHeight: 1.1,
                letterSpacing: -1,
              }}
            >
              {a.title}
            </div>
            <div
              style={{
                fontSize: 22,
                lineHeight: 1.4,
                color: "#9AA6BC",
                maxWidth: 520,
              }}
            >
              {a.excerpt}
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
              {a.readTime}
            </div>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
