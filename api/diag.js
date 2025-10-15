export default function handler(req, res) {
  res.status(200).json({
    method: req.method,
    has_ADMIN_TRACK_ENDPOINT: !!process.env.ADMIN_TRACK_ENDPOINT,
    has_ADMIN_SHARED_SECRET: !!process.env.ADMIN_SHARED_SECRET,
    forwarded_origin: process.env.FORWARDED_ORIGIN || null,
    node: process.versions?.node || null
  });
}
