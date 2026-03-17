"use client";

import { FormEvent, useState } from "react";

type AuditSection = {
  score: number;
  issues: string[];
  recommendations: string[];
};

type RoastData = {
  overallScore: number;
  summary: string;
  seo: AuditSection;
  copy: AuditSection;
  ux: AuditSection;
  conversion: AuditSection;
  topPriorities: string[];
  roast: string;
};

function scoreColor(score: number) {
  if (score >= 80) return "from-emerald-400 to-teal-500";
  if (score >= 60) return "from-sky-400 to-cyan-500";
  if (score >= 40) return "from-amber-400 to-orange-500";
  return "from-rose-400 to-red-500";
}

function scoreBadge(score: number) {
  if (score >= 80) return "Muy sólido";
  if (score >= 60) return "Buen potencial";
  if (score >= 40) return "Mejorable";
  return "Crítico";
}

function SectionCard({
  title,
  data,
}: {
  title: string;
  data: AuditSection;
}) {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20 backdrop-blur-xl">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-white/50">
            Auditoría
          </p>
          <h3 className="text-2xl font-semibold text-white">{title}</h3>
        </div>

        <div
          className={`rounded-full bg-gradient-to-r px-4 py-2 text-sm font-semibold text-white ${scoreColor(
            data.score
          )}`}
        >
          {data.score}/100
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-rose-400/20 bg-rose-500/10 p-5">
          <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-rose-200">
            Problemas detectados
          </h4>
          <ul className="space-y-3">
            {data.issues.map((item, index) => (
              <li
                key={index}
                className="rounded-xl border border-white/5 bg-black/10 p-3 text-sm leading-6 text-white/80"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-5">
          <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-emerald-200">
            Recomendaciones accionables
          </h4>
          <ul className="space-y-3">
            {data.recommendations.map((item, index) => (
              <li
                key={index}
                className="rounded-xl border border-white/5 bg-black/10 p-3 text-sm leading-6 text-white/80"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<RoastData | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
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

      if (!res.ok) {
        throw new Error(data?.error || "Ha ocurrido un error al analizar la web.");
      }

      setResult(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#06101b] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(124,58,237,0.22),transparent_28%),radial-gradient(circle_at_top_right,rgba(6,182,212,0.18),transparent_30%),linear-gradient(to_bottom,#06101b,#08111f,#0b1324)]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:34px_34px] opacity-30" />
      <div className="absolute left-[-120px] top-[-120px] h-[320px] w-[320px] rounded-full bg-fuchsia-500/20 blur-3xl" />
      <div className="absolute right-[-100px] top-[120px] h-[300px] w-[300px] rounded-full bg-cyan-500/20 blur-3xl" />

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
        <section className="rounded-[32px] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-8 lg:p-10">
          <div className="grid items-center gap-10 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <div className="mb-4 inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200">
                AI Website Roast
              </div>

              <h1 className="max-w-4xl text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-7xl">
                Audita cualquier web con una estética más viva, más premium y más seria.
              </h1>

              <p className="mt-5 max-w-2xl text-base leading-8 text-white/70 sm:text-lg">
                Analiza SEO, copy, UX y conversión con una interfaz estilo SaaS
                premium. Mete una URL y recibe un diagnóstico visualmente potente
                y fácil de entender.
              </p>

              <form
                onSubmit={handleSubmit}
                className="mt-8 flex flex-col gap-3 sm:flex-row"
              >
                <input
                  type="url"
                  placeholder="https://tuweb.com"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="h-14 w-full rounded-2xl border border-white/10 bg-black/20 px-5 text-white placeholder:text-white/35 outline-none ring-0 transition focus:border-cyan-400/50 focus:bg-black/30"
                  required
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="h-14 rounded-2xl bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-500 px-6 font-semibold text-white shadow-lg shadow-fuchsia-500/20 transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? "Analizando..." : "Analizar web"}
                </button>
              </form>

              {error ? (
                <div className="mt-4 rounded-2xl border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                  {error}
                </div>
              ) : null}
            </div>

            <div className="grid gap-4">
              <div className="rounded-3xl border border-white/10 bg-black/20 p-6">
                <p className="text-sm font-medium text-white/50">Qué analiza</p>
                <div className="mt-4 flex flex-wrap gap-3">
                  {["SEO", "Copy", "UX", "Conversión", "CTAs", "Jerarquía"].map(
                    (item) => (
                      <span
                        key={item}
                        className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80"
                      >
                        {item}
                      </span>
                    )
                  )}
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 p-6">
                <p className="text-sm font-medium text-white/50">Resultado</p>
                <p className="mt-3 text-2xl font-semibold text-white">
                  Informe visual claro y accionable
                </p>
                <p className="mt-2 text-sm leading-7 text-white/65">
                  Verás puntuaciones, problemas detectados, recomendaciones concretas
                  y prioridades claras para mejorar la página.
                </p>
              </div>
            </div>
          </div>
        </section>

        {result && (
          <>
            <section className="rounded-[32px] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-8">
              <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/45">
                    Resumen ejecutivo
                  </p>
                  <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                    Diagnóstico general de la web
                  </h2>
                  <p className="mt-5 max-w-3xl text-base leading-8 text-white/70">
                    {result.summary}
                  </p>

                  <div className="mt-8 rounded-3xl border border-white/10 bg-black/20 p-5">
                    <p className="mb-4 text-sm font-semibold uppercase tracking-wider text-cyan-200">
                      Top prioridades
                    </p>
                    <ul className="space-y-3">
                      {result.topPriorities.map((item, index) => (
                        <li
                          key={index}
                          className="rounded-2xl border border-white/5 bg-white/5 p-4 text-sm leading-6 text-white/80"
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="flex flex-col items-center justify-center rounded-[28px] border border-white/10 bg-black/20 p-8">
                  <div
                    className={`flex h-44 w-44 items-center justify-center rounded-full bg-gradient-to-br ${scoreColor(
                      result.overallScore
                    )} p-[1px] shadow-2xl`}
                  >
                    <div className="flex h-full w-full flex-col items-center justify-center rounded-full bg-[#08111c]">
                      <span className="text-5xl font-black text-white">
                        {result.overallScore}
                      </span>
                      <span className="mt-1 text-sm text-white/50">/100</span>
                    </div>
                  </div>

                  <div className="mt-5 text-center">
                    <p className="text-sm text-white/50">Score global</p>
                    <p className="mt-1 text-xl font-semibold text-white">
                      {scoreBadge(result.overallScore)}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <div className="grid gap-6 xl:grid-cols-2">
              <SectionCard title="SEO" data={result.seo} />
              <SectionCard title="Copy" data={result.copy} />
              <SectionCard title="UX" data={result.ux} />
              <SectionCard title="Conversión" data={result.conversion} />
            </div>

            <section className="rounded-[32px] border border-white/10 bg-gradient-to-r from-fuchsia-500/10 via-violet-500/10 to-cyan-500/10 p-6 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-8">
              <div className="mb-4 inline-flex rounded-full border border-rose-300/20 bg-rose-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-rose-100">
                Roast estratégico
              </div>
              <p className="max-w-4xl text-lg leading-8 text-white/85">
                {result.roast}
              </p>
            </section>
          </>
        )}
      </div>
    </main>
  );
}