"use client";

import { useEffect, useRef, useState } from "react";

/** Bungkus elemen supaya muncul halus saat masuk layar. */
export default function Muncul({
  children,
  className = "",
  jeda = 0,
}: {
  children: React.ReactNode;
  className?: string;
  jeda?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [terlihat, setTerlihat] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setTerlihat(true);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -10% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={`muncul ${terlihat ? "terlihat" : ""} ${className}`} style={{ transitionDelay: `${jeda}ms` }}>
      {children}
    </div>
  );
}
