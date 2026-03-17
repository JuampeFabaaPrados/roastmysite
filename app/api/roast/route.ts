import { NextRequest, NextResponse } from "next/server";
import { extractWebsiteData } from "@/lib/extractWebsiteData";
import { openai } from "@/lib/openai";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const url = body?.url;

    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "URL inválida" }, { status: 400 });
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "Falta la OPENAI_API_KEY en .env.local" },
        { status: 500 }
      );
    }

    const websiteData = await extractWebsiteData(url);

    const prompt = `
Analiza esta web usando los datos extraídos.

IMPORTANTE:
- Sé profesional y técnico
- Sé específico, no genérico
- Detecta problemas reales de SEO, UX, copy y conversión
- Explica qué está mal exactamente
- Da recomendaciones accionables y concretas
- En recomendaciones, di textos, estructuras, elementos o cambios específicos
- Si faltan datos visuales exactos, infiere con prudencia a partir del HTML y del contenido textual
- Piensa como un consultor senior de CRO, UX/UI y marketing digital

DATOS DE LA WEB:

URL: ${websiteData.url}
TITLE: ${websiteData.title}
META DESCRIPTION: ${websiteData.metaDescription}
H1: ${websiteData.h1s.join(" | ")}
H2: ${websiteData.h2s.join(" | ")}
PARAGRAPHS: ${websiteData.paragraphs.join(" | ")}
BUTTONS: ${websiteData.buttonsText.join(" | ")}
FORMS COUNT: ${websiteData.formsCount}
LINKS COUNT: ${websiteData.linksCount}
IMAGES COUNT: ${websiteData.imagesCount}
BODY TEXT SAMPLE: ${websiteData.bodyTextSample}

Devuelve SOLO JSON válido con esta estructura exacta:

{
  "overallScore": number,
  "summary": "string",
  "seo": {
    "score": number,
    "issues": ["string"],
    "recommendations": ["string"]
  },
  "copy": {
    "score": number,
    "issues": ["string"],
    "recommendations": ["string"]
  },
  "ux": {
    "score": number,
    "issues": ["string"],
    "recommendations": ["string"]
  },
  "conversion": {
    "score": number,
    "issues": ["string"],
    "recommendations": ["string"]
  },
  "topPriorities": ["string"],
  "roast": "string"
}

REGLAS:
- Cada lista de "issues" debe tener entre 3 y 6 puntos
- Cada lista de "recommendations" debe tener entre 3 y 6 puntos
- Las recomendaciones deben decir qué cambiar exactamente
- No repitas frases
- No pongas markdown
- No pongas texto fuera del JSON
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.4,
      messages: [
        {
          role: "system",
          content: `
Eres un experto senior en CRO, UX, UI, copywriting y SEO técnico.

Tu trabajo es auditar páginas web como lo haría una consultora de conversión.

Debes:
- ser preciso
- ser técnico
- ser accionable
- evitar frases vagas
- detectar problemas concretos
- proponer cambios exactos

Ejemplos de buen nivel:
- "El H1 no comunica una propuesta de valor clara ni un beneficio directo"
- "El CTA principal debería usar un verbo de acción específico como 'Empieza gratis' en lugar de texto ambiguo"
- "Falta prueba social visible cerca del primer bloque de contenido"
- "La meta description no parece optimizada para intención de búsqueda ni para mejorar CTR"

Devuelve solo JSON válido.
          `,
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const content = completion.choices[0]?.message?.content;

    if (!content) {
      throw new Error("La IA no devolvió contenido.");
    }

    const parsed = JSON.parse(content);

    return NextResponse.json({
      success: true,
      data: parsed,
    });
  } catch (error) {
    console.error("ERROR API:", error);

    const message =
      error instanceof Error ? error.message : "Error desconocido";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}