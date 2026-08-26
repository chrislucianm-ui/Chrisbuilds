// Delivered by Originkit · stack: nextjs · styling: tailwind
"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  children: ReactNode;
};

const BASE_CLASS =
  "inline-flex h-10 w-fit shrink-0 touch-manipulation items-center justify-center rounded-[8px] font-tight text-[14px] font-medium tracking-[-0.28px] whitespace-nowrap transition-[opacity,transform,border-color,background-color] duration-200 ease [-webkit-tap-highlight-color:transparent] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white active:scale-[0.97] motion-reduce:active:scale-100 cursor-pointer";

export const Button = ({
  variant = "primary",
  children,
  className = "",
  type = "button",
  ...props
}: ButtonProps) => {
  if (variant === "secondary") {
    return (
      <button
        type={type}
        className={`${BASE_CLASS} border border-solid border-[#c8c8c8] bg-transparent px-4 py-3 text-white [@media(hover:hover)_and_(pointer:fine)]:hover:border-white [@media(hover:hover)_and_(pointer:fine)]:hover:bg-white/5 ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }

  return (
    <button
      type={type}
      className={`${BASE_CLASS} relative overflow-hidden border border-solid border-white/20 bg-white px-5 text-[#101010] shadow-[0px_2px_6px_0px_rgba(0,0,0,0.22)] [@media(hover:hover)_and_(pointer:fine)]:hover:opacity-90 ${className}`}
      {...props}
    >
      <span className="relative z-10">{children}</span>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[inherit] shadow-[inset_0px_4px_4px_0px_rgba(255,255,255,0.25)]"
      />
    </button>
  );
};
