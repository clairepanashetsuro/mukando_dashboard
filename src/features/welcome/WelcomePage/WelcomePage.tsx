"use client";

import { HandCoins, PiggyBank, Receipt } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Brand } from "@/components/Brand/Brand";
import { Button } from "@/components/Button/Button";
import { Illustration } from "@/components/Illustration/Illustration";
import { LinkButton } from "@/components/LinkButton/LinkButton";
import { Logo } from "@/components/Logo/Logo";
import { ProgressDots } from "@/components/ProgressDots/ProgressDots";
import type { IllustrationKey } from "@/lib/illustrations";
import "./WelcomePage.css";

interface Slide {
  icon: LucideIcon;
  art: IllustrationKey;
  title: string;
  text: string;
}

const SLIDES: readonly Slide[] = [
  {
    icon: PiggyBank,
    art: "circleOfHands",
    title: "Save together",
    text: "Your treasurer adds the members and records every contribution for the whole group.",
  },
  {
    icon: HandCoins,
    art: "gathering",
    title: "Borrow with clarity",
    text: "Borrow up to twice your contributions, with the interest and due date shown upfront.",
  },
  {
    icon: Receipt,
    art: "growth",
    title: "Repay and grow",
    text: "Every repayment updates the loan balance, so the group savings keep growing.",
  },
];

export function WelcomePage({ onDone }: { onDone: () => void }) {
  const [stage, setStage] = useState<"splash" | "slides">("splash");
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (stage !== "splash") return;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const timer = setTimeout(() => setStage("slides"), reduced ? 900 : 2300);
    return () => clearTimeout(timer);
  }, [stage]);

  if (stage === "splash") {
    return (
      <main className="welcome-splash" aria-label="Mukando">
        <Logo size={96} animated />
        <div className="welcome-wordmark">Mukando</div>
      </main>
    );
  }

  const slide = SLIDES[index];
  const Icon = slide.icon;
  const last = index === SLIDES.length - 1;

  return (
    <main className="welcome">
      <header className="welcome-top">
        <Brand />
        {!last && <LinkButton onClick={onDone}>Skip</LinkButton>}
      </header>
      <div className="welcome-stage" aria-live="polite">
        <section
          className="welcome-slide"
          key={index}
          aria-labelledby="welcome-title"
        >
          <Illustration
            name={slide.art}
            className="welcome-art"
            priority={index === 0}
          />
          <div className="welcome-copy">
            <span className="welcome-icon">
              <Icon size={28} aria-hidden="true" />
            </span>
            <h2 className="welcome-title" id="welcome-title">
              {slide.title}
            </h2>
            <p className="welcome-text">{slide.text}</p>
          </div>
        </section>
      </div>
      <footer className="welcome-controls">
        <ProgressDots count={SLIDES.length} current={index} />
        {last ? (
          <Button variant="primary" onClick={onDone}>
            Get Started
          </Button>
        ) : (
          <Button variant="primary" onClick={() => setIndex(index + 1)}>
            Next
          </Button>
        )}
      </footer>
    </main>
  );
}
