import React, { useEffect, useMemo, useState } from "react";

type TypewriterProps = {
  words: string[];
  typingSpeedMs?: number;   // velocidade digitando
  deletingSpeedMs?: number; // velocidade apagando
  pauseMs?: number;         // pausa quando completa a palavra
  className?: string;
  cursorClassName?: string;
};

export default function Typewriter({
  words,
  typingSpeedMs = 70,
  deletingSpeedMs = 40,
  pauseMs = 900,
  className,
  cursorClassName,
}: TypewriterProps) {
  const safeWords = useMemo(() => words.filter(Boolean), [words]);
  const [wordIndex, setWordIndex] = useState(0);
  const [text, setText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!safeWords.length) return;

    const current = safeWords[wordIndex % safeWords.length];

    // terminou de digitar -> pausa e começa apagar
    if (!isDeleting && text === current) {
      const t = setTimeout(() => setIsDeleting(true), pauseMs);
      return () => clearTimeout(t);
    }

    // terminou de apagar -> próxima palavra
    if (isDeleting && text === "") {
      setIsDeleting(false);
      setWordIndex((i) => (i + 1) % safeWords.length);
      return;
    }

    const nextText = isDeleting
      ? current.slice(0, text.length - 1)
      : current.slice(0, text.length + 1);

    const delay = isDeleting ? deletingSpeedMs : typingSpeedMs;

    const timer = setTimeout(() => setText(nextText), delay);
    return () => clearTimeout(timer);
  }, [text, isDeleting, wordIndex, safeWords, typingSpeedMs, deletingSpeedMs, pauseMs]);

  return (
    <span className={className} aria-label={safeWords[wordIndex] ?? ""}>
      {text}
      <span
        className={cursorClassName}
        style={{ display: "inline-block", marginLeft: 2 }}
        aria-hidden="true"
      >
        |
      </span>
    </span>
  );
}