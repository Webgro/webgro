"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ContactForm } from "@/components/ContactForm";

/**
 * Homepage contact section. The form itself lives in <ContactForm /> so the
 * same implementation renders on /contact too.
 */
export function ContactSection() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-contact-eyebrow]",
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          ease: "power2.out",
          immediateRender: false,
          overwrite: "auto",
          scrollTrigger: { trigger: "[data-contact-header]", start: "top 85%" },
        }
      );

      gsap.fromTo(
        "[data-contact-h2-word]",
        { y: 40, opacity: 0, filter: "blur(12px)" },
        {
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
          duration: 1.1,
          stagger: 0.12,
          ease: "power4.out",
          immediateRender: false,
          overwrite: "auto",
          scrollTrigger: { trigger: "[data-contact-grid]", start: "top 85%" },
        }
      );

      gsap.fromTo(
        "[data-contact-meta]",
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          stagger: 0.08,
          ease: "power3.out",
          immediateRender: false,
          overwrite: "auto",
          scrollTrigger: { trigger: "[data-contact-grid]", start: "top 70%" },
        }
      );

      gsap.fromTo(
        "[data-contact-form]",
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          immediateRender: false,
          overwrite: "auto",
          scrollTrigger: { trigger: "[data-contact-grid]", start: "top 80%" },
        }
      );
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={root}
      id="contact"
      className="relative overflow-hidden bg-wg-ink py-32 md:py-40"
    >
      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute -top-[20%] left-[10%] h-[70vh] w-[60vw] rounded-full bg-[radial-gradient(ellipse_at_center,_rgba(45,141,255,0.14)_0%,_transparent_70%)] blur-3xl"
          style={{ animation: "wgDrift 20s ease-in-out infinite" }}
        />
        <div
          className="absolute bottom-[5%] right-[5%] h-[60vh] w-[50vw] rounded-full bg-[radial-gradient(ellipse_at_center,_rgba(124,58,237,0.12)_0%,_transparent_70%)] blur-3xl"
          style={{ animation: "wgDrift 24s ease-in-out infinite reverse" }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-12 lg:px-16">
        {/* Eyebrow */}
        <div className="mb-16 md:mb-20" data-contact-header>
          <div className="flex items-center gap-4" data-contact-eyebrow>
            <span className="h-[1px] w-12 bg-wg-blue"></span>
            <p className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.25em] text-wg-blue">
              [ 06 ] Contact
            </p>
          </div>
        </div>

        {/* Grid */}
        <div
          data-contact-grid
          className="grid grid-cols-1 gap-16 md:grid-cols-12 md:gap-16 lg:gap-20"
        >
          {/* Left, Let's gro. signature */}
          <div className="md:col-span-5">
            <h2 className="font-[family-name:var(--font-display)] text-7xl font-bold leading-[1.05] tracking-tight text-white md:text-8xl lg:text-[9.5rem]">
              <span className="block pb-1">
                <span data-contact-h2-word className="inline-block will-change-transform">
                  Let&rsquo;s
                </span>
              </span>
              <span className="block pb-6 md:pb-8 lg:pb-10">
                <span
                  data-contact-h2-word
                  className="inline-block bg-gradient-to-r from-wg-blue via-wg-violet to-wg-teal bg-clip-text pr-[0.35em] italic text-transparent will-change-transform"
                >
                  gro.
                </span>
              </span>
            </h2>

            <p
              data-contact-meta
              className="mt-12 max-w-sm text-lg leading-relaxed text-white/70"
            >
              Start the conversation. 30 minutes, no decks, no pressure.
            </p>

            <div data-contact-meta className="mt-10 space-y-4">
              <a
                href="mailto:hello@webgro.co.uk"
                data-cursor="hover"
                className="group inline-flex items-center gap-3 text-xl font-medium text-white transition hover:text-wg-blue md:text-2xl"
              >
                hello@webgro.co.uk
                <span className="inline-block transition-transform group-hover:translate-x-1">
                  →
                </span>
              </a>
              <p className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.22em] text-white/50">
                Usually reply within one working day
              </p>
            </div>
          </div>

          {/* Right, shared form */}
          <div data-contact-form className="md:col-span-7">
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}
