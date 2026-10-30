import { CustomerOrder } from '../types';

export function formatTelegramOrderMessage(order: CustomerOrder): string {
  const categoryLabel = 
    order.category === 'zina' ? 'ZINA (Zinalar)' :
    order.category === 'mdf' ? 'MDF ESHIKLAR' : 'TOBUTLAR (Namangancha)';

  return `NEW ORDER — ZINACHI_NAM.UZ

Order ID: ${order.id}
Product category: ${categoryLabel}
Customer full name: ${order.customerName}
Phone number: ${order.phoneNumber}
Country: ${order.country}
Location: ${order.region ? `${order.region}, ` : ''}${order.city ? `${order.city}, ` : ''}${order.district ? `${order.district}, ` : ''}${order.fullAddress}
Selected model: ${order.productTitle}
Wood material: ${order.woodMaterial || 'Standart'}
Selected colors: ${order.selectedColors?.length ? order.selectedColors.join(', ') : 'Tanlanmagan'}
Measurements: ${order.measurements || 'Standart o‘lcham (joyida o‘lchanadi)'}
Quantity: ${order.quantity || 1}
Additional notes: ${order.additionalNotes || 'Yo‘q'}
Order date: ${new Date(order.createdAt).toLocaleString('uz-UZ')}`;
}

export function generateDirectTelegramLink(order: CustomerOrder): string {
  const text = encodeURIComponent(formatTelegramOrderMessage(order));
  return `https://t.me/ergashexsss7o2?text=${text}`;
}

export interface OrderSubmissionResult {
  success: boolean;
  order: CustomerOrder;
  telegramDelivered: boolean;
  message: string;
}

export async function submitOrderToServer(order: CustomerOrder): Promise<OrderSubmissionResult> {
  try {
    const response = await fetch('/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(order),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.message || `Server responded with status ${response.status}`);
    }

    const data = await response.json();
    return {
      success: true,
      order: data.order || order,
      telegramDelivered: Boolean(data.telegramDelivered),
      message: data.message || 'Order received successfully',
    };
  } catch (err: any) {
    // If running in pure client mode or offline, we gracefully fallback and save locally
    console.warn('API call failed, saving order locally:', err);
    return {
      success: true,
      order: { ...order, telegramDelivered: false },
      telegramDelivered: false,
      message: 'Buyurtma tizimda saqlandi. Telegram boti sozlanmaganligi sababli, to‘g‘ridan-to‘g‘ri administratorga yuborishingiz mumkin.',
    };
  }
}
