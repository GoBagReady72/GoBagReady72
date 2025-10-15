export const runtime = 'nodejs';
export async function GET() {
  return Response.json({ ok: true, app: 'game', time: new Date().toISOString() });
}
