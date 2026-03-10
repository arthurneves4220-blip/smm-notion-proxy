module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const NOTION_TOKEN = process.env.NOTION_TOKEN;
  if (!NOTION_TOKEN) {
    return res.status(500).json({ error: "NOTION_TOKEN nao configurado" });
  }

  const notionPath = req.query.path || "";
  const notionUrl = "https://api.notion.com/v1/" + notionPath;

  try {
    var options = {
      method: req.method,
      headers: {
        "Authorization": "Bearer " + NOTION_TOKEN,
        "Notion-Version": "2022-06-28",
        "Content-Type": "application/json"
      }
    };

    if (req.method !== "GET" && req.method !== "OPTIONS" && req.body) {
      options.body = JSON.stringify(req.body);
    }

    var response = await fetch(notionUrl, options);
    var data = await response.json();
    return res.status(response.status).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
