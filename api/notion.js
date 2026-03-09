// api/notion.js — Proxy para a Notion API
// Deploy na Vercel: este arquivo vira automaticamente um servidor

const NOTION_TOKEN = process.env.NOTION_TOKEN; // configurado nas env vars da Vercel

module.exports = async function handler(req, res) {
  // Libera CORS para qualquer origem
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // Pega o caminho após /api/notion
  // Ex: /api/notion/databases/ID/query → /v1/databases/ID/query
  const notionPath = req.url.replace("/api/notion", "");
  const notionUrl = `https://api.notion.com/v1${notionPath}`;

  try {
    const response = await fetch(notionUrl, {
      method: req.method,
      headers: {
        Authorization: `Bearer ${NOTION_TOKEN}`,
        "Notion-Version": "2022-06-28",
        "Content-Type": "application/json",
      },
      body: req.method !== "GET" ? JSON.stringify(req.body) : undefined,
    });

    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao conectar com o Notion", details: error.message });
  }
}
