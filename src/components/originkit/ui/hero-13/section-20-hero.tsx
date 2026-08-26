// Delivered by Originkit · stack: nextjs · styling: tailwind
"use client";

"use client";

import GalleryTunnel from "@/components/originkit/ui/hero-13/gallery-tunnel";
import { HeroContent } from "@/components/originkit/ui/hero-13/hero-content";

/** Public asset under /sections/hero-13/assets */
function asset(file: string) {
  return `/originkit/hero-13/${file}`;
}

/** Dark slabs so non-photo panels stay invisible in the tunnel. */
const TUNNEL_COLORS = ["#181818", "#1c1c1c", "#222222", "#161616"];
const DEFAULT_IMAGES = [
  { src: asset("potrait-1.png") },
  { src: asset("potrait-2.png") },
  { src: asset("potrait-3.png") },
  { src: asset("potrait-4.png") },
  { src: asset("potrait-5.png") },
  { src: asset("potrait-6.png") },
];

export const Section20Hero = () => {
  const handleExploreGallery = () => {
    if (typeof window !== "undefined") {
      window.location.hash = "#services";
    }
  };

  const handleBookShoot = () => {
    const defaultMessage = encodeURIComponent(
      "Hi Chris! I visited your portfolio website and would like to discuss a project with you."
    );
    const whatsappUrl = `https://wa.me/918738882912?text=${defaultMessage}`;
    if (typeof window !== "undefined") {
      window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <section
      aria-label="Elevating portraits through perspective"
      className="relative isolate flex min-h-svh w-full items-center justify-center overflow-hidden bg-[#131313]"
    >
      {/* 3D portrait tunnel */}
      <div
        aria-hidden="true"
        className="pointer-events-auto absolute inset-0 z-0"
      >
        <GalleryTunnel
          images={DEFAULT_IMAGES}
          background="#131313"
          lineColor="#B0B0B0"
          lineOpacity={0}
          grid={8}
          speed={50}
          boost={100}
          fade={100}
          label={false}
        />
      </div>

      {/* Smooth radial vignette wash behind text so copy stays readable while 3D images blend naturally */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 z-10 h-[80vh] w-[100vw] wide-lg:w-[50vw] wide-lg:h-[50vh] ipad:w-[75vw] desktop-sm:w-[85vh] desktop-sm:w-[55vw] -translate-x-1/2 -translate-y-1/2 bg-[#131313] blur-[25px]"
      />

      <div className="pointer-events-none relative z-20 flex w-full max-w-[763px] items-center justify-center py-12">
        <div className="pointer-events-auto relative flex w-full items-center justify-center">
          <HeroContent
            onExploreGallery={handleExploreGallery}
            onBookShoot={handleBookShoot}
          />
        </div>
      </div>
    </section>
  );
};
