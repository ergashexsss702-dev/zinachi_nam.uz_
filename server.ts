import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// In-memory persistent order store for fast access
interface StoredOrder {
  id: string;
  category: 'zina' | 'mdf' | 'tobut';
  productTitle: string;
  productDesignId: string;
  woodMaterial?: string;
  selectedColors: string[];
  customerName: string;
  phoneNumber: string;
  country: string;
  countryCode: string;
  region: string;
  city: string;
  district: string;
  fullAddress: string;
  locationCoordinates?: string;
  measurements?: string;
  quantity?: number;
  doorMaterialFinish?: string;
  additionalNotes?: string;
  status: string;
  createdAt: string;
  telegramDelivered: boolean;
}

const ordersStore: StoredOrder[] = [];

// Seed sample demo order if empty so admin dashboard looks complete on launch
if (ordersStore.length === 0) {
  ordersStore.push({
    id: 'ZIN-9437501',
    category: 'zina',
    productTitle: 'Klassik o‘ymakor hashamatli zina',
    productDesignId: 'zina-classic-carved',
    woodMaterial: 'A — YONG‘OQ',
    selectedColors: ['Dark Walnut', 'Golden Oak'],
    customerName: 'Akmal Karimov',
    phoneNumber: '+998 90 123 45 67',
    country: 'O‘zbekiston',
    countryCode: 'UZ',
    region: 'Namangan viloyati',
    city: 'Namangan shahri',
    district: 'Davlatobod tumani',
    fullAddress: 'Mustaqillik ko‘chasi, 45-uy',
    measurements: 'Balandlik 3.2m, 18 pog‘ona',
    quantity: 1,
    additionalNotes: 'O‘lchov uchun usta kelishi kerak',
    status: 'jarayonda',
    createdAt: new Date(Date.now() - 3600 * 1000 * 24).toISOString(),
    telegramDelivered: true,
  });
}

// Telegram dispatch helper
async function sendTelegramMessage(text: string): Promise<boolean> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.log('[Telegram Bot] Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID. Message logged to console:');
    console.log(text);
    return false;
  }

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: text,
        parse_mode: 'HTML',
      }),
    });

    const data = await res.json();
    return Boolean(data.ok);
  } catch (err) {
    console.error('[Telegram Bot] Error sending message:', err);
    return false;
  }
}

// Format message for Telegram
function buildTelegramText(order: StoredOrder): string {
  const categoryLabel = 
    order.category === 'zina' ? 'ZINA (Zinalar)' :
    order.category === 'mdf' ? 'MDF ESHIKLAR' : 'TOBUTLAR (Namangancha)';

  return `<b>NEW ORDER — ZINACHI_NAM.UZ</b>

<b>Order ID:</b> <code>${order.id}</code>
<b>Product category:</b> ${categoryLabel}
<b>Customer full name:</b> ${order.customerName}
<b>Phone number:</b> ${order.phoneNumber}
<b>Country:</b> ${order.country}
<b>Location:</b> ${[order.region, order.city, order.district, order.fullAddress].filter(Boolean).join(', ')}
<b>Selected model:</b> ${order.productTitle}
<b>Wood material:</b> ${order.woodMaterial || 'Standart'}
<b>Selected colors:</b> ${order.selectedColors?.length ? order.selectedColors.join(', ') : 'Tanlanmagan'}
<b>Measurements:</b> ${order.measurements || 'Standart o‘lcham'}
<b>Quantity:</b> ${order.quantity || 1}
<b>Additional notes:</b> ${order.additionalNotes || 'Yo‘q'}
<b>Order date:</b> ${new Date(order.createdAt).toLocaleString('uz-UZ')}`;
}

// API Routes
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    app: 'ZINACHI_NAM.UZ',
    telegramConfigured: Boolean(process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID),
    supabaseConfigured: Boolean(process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL),
    totalOrders: ordersStore.length,
  });
});

// GET /api/orders (admin & query)
app.get('/api/orders', (req, res) => {
  const { category, search } = req.query;
  let filtered = [...ordersStore];

  if (category && typeof category === 'string' && category !== 'all') {
    filtered = filtered.filter(o => o.category === category);
  }

  if (search && typeof search === 'string') {
    const q = search.toLowerCase();
    filtered = filtered.filter(o =>
      o.customerName.toLowerCase().includes(q) ||
      o.phoneNumber.includes(q) ||
      o.id.toLowerCase().includes(q) ||
      o.productTitle.toLowerCase().includes(q)
    );
  }

  // Sort descending by date
  filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  res.json({ orders: filtered, total: filtered.length });
});

// POST /api/orders (create & dispatch)
app.post('/api/orders', async (req, res) => {
  try {
    const body = req.body;

    if (!body.customerName || !body.phoneNumber || !body.productTitle) {
      res.status(400).json({ error: 'Missing required customer or product information' });
      return;
    }

    // Check duplicate ID
    const orderId = body.id || `ZIN-${Date.now().toString().slice(-7)}`;
    const existingIndex = ordersStore.findIndex(o => o.id === orderId);

    const orderRecord: StoredOrder = {
      id: orderId,
      category: body.category || 'zina',
      productTitle: body.productTitle,
      productDesignId: body.productDesignId || '',
      woodMaterial: body.woodMaterial,
      selectedColors: body.selectedColors || [],
      customerName: body.customerName,
      phoneNumber: body.phoneNumber,
      country: body.country || 'O‘zbekiston',
      countryCode: body.countryCode || 'UZ',
      region: body.region || '',
      city: body.city || '',
      district: body.district || '',
      fullAddress: body.fullAddress || '',
      locationCoordinates: body.locationCoordinates,
      measurements: body.measurements,
      quantity: body.quantity ? Number(body.quantity) : 1,
      doorMaterialFinish: body.doorMaterialFinish,
      additionalNotes: body.additionalNotes,
      status: body.status || 'yangi',
      createdAt: body.createdAt || new Date().toISOString(),
      telegramDelivered: false,
    };

    // Attempt Telegram dispatch
    const tgText = buildTelegramText(orderRecord);
    const delivered = await sendTelegramMessage(tgText);
    orderRecord.telegramDelivered = delivered;

    if (existingIndex >= 0) {
      ordersStore[existingIndex] = orderRecord;
    } else {
      ordersStore.unshift(orderRecord);
    }

    res.status(201).json({
      success: true,
      order: orderRecord,
      telegramDelivered: delivered,
      message: delivered
        ? 'Buyurtma muvaffaqiyatli qabul qilindi va Telegram boti orqali administratorga yuborildi.'
        : 'Buyurtma tizimda saqlandi. Telegram boti sozlanmaganligi sababli, to‘g‘ridan-to‘g‘ri administratorga yuborish havolasidan foydalanishingiz mumkin.',
    });
  } catch (err: any) {
    console.error('Order creation error:', err);
    res.status(500).json({ error: 'Internal server error processing order' });
  }
});

// PATCH /api/orders/:id/status
app.patch('/api/orders/:id/status', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const validStatuses = ['yangi', 'qabul_qilindi', 'jarayonda', 'tayyor', 'yetkazildi', 'bekor_qilindi'];
  if (!validStatuses.includes(status)) {
    res.status(400).json({ error: 'Invalid order status' });
    return;
  }

  const order = ordersStore.find(o => o.id === id);
  if (!order) {
    res.status(404).json({ error: 'Order not found' });
    return;
  }

  order.status = status;
  res.json({ success: true, order });
});

// Vite or Static handling
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`ZINACHI_NAM.UZ server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
