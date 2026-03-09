
Copiar

const https = require("https");

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const NOTION_TOKEN = process.env.NOTION_TOKEN;
  if (!NOTION_TOKEN) {
    return res.status(500).json({ error: "NOTION_TOKEN não configurado" });
  }

  const notionPath = req.query.path || "";
  const notionUrl = `https://api.notion.com/v1/${notionPath}`;

  try {
    // Lê o body corretamente
    let body = undefined;
    if (req.method !== "GET" && req.method !== "OPTIONS") {
      if (typeof req.body === "object") {
        body = JSON.stringify(req.body);
      } else if (typeof req.body === "string") {
        body = req.body;
      } else {
        body = await new Promise((resolve) => {
          let data = "";
          req.on("data", chunk => data += chunk);
          req.on("end", () => resolve(data));
        });
      }
    }

    const response = await fetch(notionUrl, {
      method: req.method,
      headers: {
        Authorization: `Bearer ${NOTION_TOKEN}`,
        "Notion-Version": "2022-06-28",
        "Content-Type": "application/json",
      },
      body,
    });

    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
