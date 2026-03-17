import * as cheerio from "cheerio";

export type ExtractedWebsiteData = {
  url: string;
  title: string;
  metaDescription: string;
  h1s: string[];
  h2s: string[];
  paragraphs: string[];
  bodyTextSample: string;
  linksCount: number;
  imagesCount: number;
  formsCount: number;
  buttonsText: string[];
};

function normalizeUrl(input: string) {
  const trimmed = input.trim();

  if (!trimmed.startsWith("http://") && !trimmed.startsWith("https://")) {
    return `https://${trimmed}`;
  }

  return trimmed;
}

export async function extractWebsiteData(inputUrl: string): Promise<ExtractedWebsiteData> {
  const url = normalizeUrl(inputUrl);

  const response = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`No se pudo acceder a la web. Status: ${response.status}`);
  }

  const html = await response.text();
  const $ = cheerio.load(html);

  const title = $("title").first().text().trim() || "Sin título";

  const metaDescription =
    $('meta[name="description"]').attr("content")?.trim() ||
    "Sin meta description";

  const h1s = $("h1")
    .map((_, el) => $(el).text().trim())
    .get()
    .slice(0, 5);

  const h2s = $("h2")
    .map((_, el) => $(el).text().trim())
    .get()
    .slice(0, 10);

  const paragraphs = $("p")
    .map((_, el) => $(el).text().trim())
    .get()
    .filter((t) => t.length > 30)
    .slice(0, 10);

  const bodyTextSample = $("body")
    .text()
    .replace(/\s+/g, " ")
    .slice(0, 4000);

  const linksCount = $("a").length;
  const imagesCount = $("img").length;
  const formsCount = $("form").length;

  const buttonsText = $("button, a")
    .map((_, el) => $(el).text().trim())
    .get()
    .filter((t) => t.length > 0 && t.length < 50)
    .slice(0, 20);

  return {
    url,
    title,
    metaDescription,
    h1s,
    h2s,
    paragraphs,
    bodyTextSample,
    linksCount,
    imagesCount,
    formsCount,
    buttonsText,
  };
}