"use client";

import { useState } from "react";

type RoastSection = {
  score: number;
  issues: string[];
  recommendations: string[];
};

type RoastResponse = {
  success?: boolean;
  data?: {
    overallScore: number;
    summary: string;
    seo: RoastSection;
    copy: RoastSection;
    ux: RoastSection;
    conversion: RoastSection;
    topPriorities: string[];
    roast: string;
  };
  error?: string;
};

export default function Home() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<RoastResponse | null>(null);

  const handleAnalyze = async () => {
    if (!url.trim()) return;

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/roast", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });

      const data = await res.json();
      setResult(data);
    } catch {
      setResult({ error: "Error conectando con la API" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-black px-6 py-16 text-white">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-5xl font-bold tracking-tight">SiteRoast AI</h1>
        <p className="mt-4 max-w-2xl text-lg text-zinc-300">
          Descubre por qué tu web está perdiendo clientes y qué cambiar
          exactamente para mejorar SEO, UX, copy y conversión.
        </p>

        <div className="mt-8 flex flex-col gap-4 sm:flex-row">
          <input
            type="text"
            placeholder="Introduce una URL, por ejemplo: nike.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-white outline-none"
          />
          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="rounded-xl bg-white px-6 py-3 font-semibold text-black transition hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Analizando..." : "Roast my site"}
          </button>
        </div>

        {result?.error && (
          <div className="mt-8 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-200">
            {result.error}
          </div>
        )}

        {result?.data && (
          <div className="mt-10 space-y-6">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
              <p className="text-sm uppercase tracking-widest text-zinc-400">
                Overall score
              </p>
              <p className="mt-2 text-6xl font-bold">
                {result.data.overallScore}/100
              </p>
              <p className="mt-4 text-lg text-zinc-300">
                {result.data.summary}
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <SectionCard
                title="SEO"
                score={result.data.seo.score}
                issues={result.data.seo.issues}
                recommendations={result.data.seo.recommendations}
              />

              <SectionCard
                title="UX"
                score={result.data.ux.score}
                issues={result.data.ux.issues}
                recommendations={result.data.ux.recommendations}
              />

              <SectionCard
                title="Copywriting"
                score={result.data.copy.score}
                issues={result.data.copy.issues}
                recommendations={result.data.copy.recommendations}
              />

              <SectionCard
                title="Conversión"
                score={result.data.conversion.score}
                issues={result.data.conversion.issues}
                recommendations={result.data.conversion.recommendations}
              />
            </div>

            <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
              <h2 className="text-2xl font-semibold">Top prioridades</h2>
              <ul className="mt-4 list-disc space-y-2 pl-5 text-zinc-300">
                {result.data.topPriorities.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
              <h2 className="text-2xl font-semibold">Roast final</h2>
              <p className="mt-4 text-zinc-300">{result.data.roast}</p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

function SectionCard({
  title,
  score,
  issues,
  recommendations,
}: {
  title: string;
  score: number;
  issues: string[];
  recommendations: string[];
}) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-2xl font-semibold">{title}</h2>
        <span className="text-2xl font-bold">{score}/100</span>
      </div>

      <div className="mt-5">
        <h3 className="font-medium text-zinc-200">Problemas detectados</h3>
        <ul className="mt-2 list-disc space-y-2 pl-5 text-sm text-zinc-400">
          {issues.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>

      <div className="mt-6">
        <h3 className="font-medium text-zinc-200">Qué cambiar exactamente</h3>
        <ul className="mt-2 list-disc space-y-2 pl-5 text-sm text-zinc-400">
          {recommendations.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}