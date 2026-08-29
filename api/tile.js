export default async function handler(req, res) {
  const { z, x, y } = req.query || {};
  if (![z, x, y].every((v) => /^\d+$/.test(String(v || "")))) {
    res.status(400).send("bad tile");
    return;
  }
  const url = `https://s3.amazonaws.com/elevation-tiles-prod/terrarium/${z}/${x}/${y}.png`;
  const r = await fetch(url);
  if (!r.ok) {
    res.status(r.status).send("tile missing");
    return;
  }
  const buf = Buffer.from(await r.arrayBuffer());
  res.setHeader("Content-Type", "image/png");
  res.setHeader("Cache-Control", "public, max-age=86400");
  res.status(200).send(buf);
}
