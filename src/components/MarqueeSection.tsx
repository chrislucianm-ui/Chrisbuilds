"use client";
import React, { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const MARQUEE_IMAGES = [
  "https://motionsites.ai/assets/hero-space-voyage-preview-eECLH3Yc.gif",
  "https://motionsites.ai/assets/hero-codenest-preview-Cgppc2qV.gif",
  "https://motionsites.ai/assets/hero-vex-ventures-preview-BczMFIiw.gif",
  "https://motionsites.ai/assets/hero-stellar-ai-v2-preview-DjvxjG3C.gif",
  "https://motionsites.ai/assets/hero-asme-preview-B_nGDnTP.gif",
  "https://motionsites.ai/assets/hero-transform-data-preview-Cx5OU29N.gif",
  "https://motionsites.ai/assets/hero-vitara-preview-Cjz2QYyU.gif",
  "https://motionsites.ai/assets/hero-terra-preview-BFjrCr7T.gif",
  "https://motionsites.ai/assets/hero-skyelite-preview-DHaZIgUv.gif",
  "https://motionsites.ai/assets/hero-aethera-preview-DknSlcTa.gif",
  "https://motionsites.ai/assets/hero-designpro-preview-D8c5_een.gif",
  "https://motionsites.ai/assets/hero-stellar-ai-preview-D3HL6bw1.gif",
  "https://motionsites.ai/assets/hero-xportfolio-preview-D4A8maiC.gif",
  "https://motionsites.ai/assets/hero-orbit-web3-preview-BXt4OttD.gif",
  "https://motionsites.ai/assets/hero-nexora-preview-cx5HmUgo.gif",
  "https://motionsites.ai/assets/hero-evr-ventures-preview-DZxeVFEX.gif",
  "https://motionsites.ai/assets/hero-planet-orbit-preview-DWAP8Z1P.gif",
  "https://motionsites.ai/assets/hero-new-era-preview-CocuDUm9.gif",
  "https://motionsites.ai/assets/hero-wealth-preview-B70idl_u.gif",
  "https://motionsites.ai/assets/hero-luminex-preview-CxOP7ce6.gif",
  "https://motionsites.ai/assets/hero-celestia-preview-0yO3jXO8.gif",
];

export function MarqueeSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const row1Ref = useRef<HTMLDivElement>(null);
  const row2Ref = useRef<HTMLDivElement>(null);

  const row1Raw = MARQUEE_IMAGES.slice(0, 11);
  const row2Raw = MARQUEE_IMAGES.slice(11);

  const row1 = [...row1Raw, ...row1Raw, ...row1Raw];
  const row2 = [...row2Raw, ...row2Raw, ...row2Raw];

  useEffect(() => {
    const r1 = row1Ref.current;
    const r2 = row2Ref.current;
    if (!r1 || !r2) return;

    const ctx = gsap.context(() => {
      // Row 1 moves right
      gsap.fromTo(
        r1,
        { x: -350 },
        {
          x: 50,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        }
      );

      // Row 2 moves left
      gsap.fromTo(
        r2,
        { x: 50 },
        {
          x: -350,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="bg-[#0C0C0C] pt-24 sm:pt-32 md:pt-40 pb-10 overflow-hidden flex flex-col gap-3"
    >
      {/* Row 1: moves RIGHT */}
      <div
        ref={row1Ref}
        className="flex gap-3 whitespace-nowrap will-change-transform"
      >
        {row1.map((url, i) => (
          <img
            key={`r1-${i}`}
            src={url}
            alt="Design Preview"
            loading="lazy"
            className="w-[420px] h-[270px] flex-shrink-0 rounded-2xl object-cover select-none"
          />
        ))}
      </div>

      {/* Row 2: moves LEFT */}
      <div
        ref={row2Ref}
        className="flex gap-3 whitespace-nowrap will-change-transform"
      >
        {row2.map((url, i) => (
          <img
            key={`r2-${i}`}
            src={url}
            alt="Design Preview"
            loading="lazy"
            className="w-[420px] h-[270px] flex-shrink-0 rounded-2xl object-cover select-none"
          />
        ))}
      </div>
    </section>
  );
}
