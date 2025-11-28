import fetch from "node-fetch";
import formidable from "formidable";
import fs from "fs";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  try {
    const form = new formidable.IncomingForm();

    form.parse(req, async (err, fields, files) => {
      if (err) return res.status(400).json({ error: "Form parse error" });

      const caption = fields.caption || "Bukti transfer";
      const file = files.file;

      const BOT_TOKEN = process.env.BOT_TOKEN;
      const CHAT_ID = process.env.CHAT_ID;

      const fd = new FormData();
      fd.append("chat_id", CHAT_ID);
      fd.append("photo", fs.createReadStream(file.filepath));
      fd.append("caption", caption);

      const tg = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`, {
        method: "POST",
        body: fd
      });

      const resp = await tg.json();
      res.status(200).json(resp);
    });

  } catch (e) {
    console.log(e);
    res.status(500).json({ error: "Server Error", detail: e.toString() });
  }
                }
