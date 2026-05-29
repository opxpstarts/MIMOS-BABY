import { NextRequest, NextResponse } from 'next/server';
import { sendPurchaseCAPI } from '@/lib/capi';
import { pendingPurchases } from '@/lib/pending-purchases';
import fs from 'fs';
import path from 'path';

const BUYPIX_URL = 'https://buypix.me/api/v1';
const DATA_FILE = path.join(process.cwd(), 'data', 'pending-purchases.json');
const CRON_SECRET = process.env.CRON_SECRET ?? 'mimus-cron-2026';

export async function GET(req: NextRequest) {
  // Proteção básica por secret
  const secret = req.nextUrl.searchParams.get('secret');
  if (secret !== CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Lê todas as compras pendentes
  let store: Record<string, unknown> = {};
  try {
    if (!fs.existsSync(DATA_FILE)) {
      return NextResponse.json({ checked: 0, paid: 0 });
    }
    store = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
  } catch {
    return NextResponse.json({ error: 'Erro ao ler pending-purchases' }, { status: 500 });
  }

  const ids = Object.keys(store);
  if (ids.length === 0) {
    return NextResponse.json({ checked: 0, paid: 0 });
  }

  console.log(`[cron] Verificando ${ids.length} compras pendentes...`);

  let paid = 0;
  const results: string[] = [];

  for (const id of ids) {
    try {
      const res = await fetch(`${BUYPIX_URL}/deposits/${id}`, {
        headers: {
          Authorization: `Bearer ${process.env.BUYPIX_API_KEY}`,
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
      });

      const json = await res.json();
      const depositData = json.data ?? json;
      const rawStatus: string = depositData.status ?? '';
      const isPaid = rawStatus === 'depix_sent';

      console.log(`[cron] id=${id} status=${rawStatus}`);

      if (isPaid) {
        const pending = pendingPurchases.get(id);
        if (pending) {
          pendingPurchases.delete(id);
          await sendPurchaseCAPI({
            eventId: id,
            value: pending.value,
            contentId: pending.contentId,
            customer: pending.customer,
            sourceUrl: pending.sourceUrl,
          });
          paid++;
          results.push(`${id}: CAPI disparada`);
          console.log(`[cron] CAPI disparada para id=${id}`);
        }
      } else {
        results.push(`${id}: ${rawStatus}`);
      }
    } catch (e) {
      console.error(`[cron] Erro ao verificar id=${id}:`, e);
      results.push(`${id}: erro`);
    }
  }

  return NextResponse.json({ checked: ids.length, paid, results });
}
