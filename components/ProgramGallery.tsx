"use client";

import { useMemo, useState } from "react";
import type { Program } from "@/lib/program";
import ProgramCard from "./ProgramCard";

export default function ProgramGallery({ program }: { program: Program[] }) {
  const kategori = useMemo(() => Array.from(new Set(program.map((p) => p.kategori))), [program]);
  const [aktif, setAktif] = useState<string | null>(null);
  const tampil = aktif ? program.filter((p) => p.kategori === aktif) : program;

  return (
    <div>
      {kategori.length > 1 && (
        <div className="mb-8 flex flex-wrap gap-2">
          {[null, ...kategori].map((k) => (
            <button
              key={k ?? "semua"}
              onClick={() => setAktif(k)}
              className={`rounded-full px-4 py-1.5 text-sm transition-colors ${
                aktif === k ? "bg-denim-900 text-white" : "bg-white text-denim-700 ring-1 ring-denim-100 hover:ring-denim-300"
              }`}
            >
              {k ?? "Semua"}
            </button>
          ))}
        </div>
      )}
      <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        {tampil.map((p) => (
          <ProgramCard key={p.slug} program={p} />
        ))}
      </div>
    </div>
  );
}
