"use client";

import type { KeyboardEvent } from "react";
import { Button } from "@/components/originkit/ui/hero-11/button";

const A = "/originkit/hero-11";

const NAV_LINKS = [
  { label: "About", href: "#about", aria: "About" },
  { label: "Services", href: "#services", aria: "Services" },
  { label: "Contact", href: "#contact", aria: "Contact" },
] as const;

type NavbarProps = {
  onBookNow: () => void;
};

const Logo = () => (
  <a
    href="#"
    aria-label="Chris Builds home"
    className="inline-flex min-h-11 items-center gap-2 touch-manipulation focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white [-webkit-tap-highlight-color:transparent]"
  >
    <span className="font-sans text-[20px] font-semibold leading-[25.5px] tracking-[-0.4px] text-white whitespace-nowrap">
      Chris Builds
    </span>
  </a>
);

export const Navbar = ({ onBookNow }: NavbarProps) => {
  const handleLinkClick = (href: string) => {
    if (typeof window !== "undefined") {
      window.location.hash = href;
    }
  };

  return (
    <nav aria-label="Primary" className="relative z-30 w-full">
      {/* Mobile — Figma Nav: logo + menu */}
      <div className="flex h-[58px] w-full items-center justify-between p-4 desktop-sm:hidden">
        <Logo />
        <Button aria-label="Contact Me" onClick={onBookNow} className="px-4 py-2 text-xs">
          Contact Me
        </Button>
      </div>

      {/* Desktop */}
      <div className="mx-auto hidden w-full max-w-[1440px] items-center justify-between px-[100px] pt-9 desktop-sm:flex">
        <ul className="flex w-[299px] items-center gap-6 font-tight text-[17px] leading-[25.5px] tracking-[-0.34px] text-white">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <button
                onClick={() => handleLinkClick(link.href)}
                className="inline-flex min-h-11 items-center touch-manipulation cursor-pointer whitespace-nowrap transition-opacity duration-200 ease focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white [-webkit-tap-highlight-color:transparent] [@media(hover:hover)_and_(pointer:fine)]:hover:opacity-70"
              >
                {link.label}
              </button>
            </li>
          ))}
        </ul>

        <Logo />

        <div className="flex w-[299px] items-center justify-end">
          <Button aria-label="Contact Me" onClick={onBookNow}>
            Contact Me
          </Button>
        </div>
      </div>
    </nav>
  );
};
