// ESM because "type":"module" in package.json
export default function handler(req, res) {
  res.status(200).json({ ok: true, app: 'game', time: new Date().toISOString() });
}
