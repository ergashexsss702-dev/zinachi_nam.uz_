import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { CustomerOrder } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

let client: SupabaseClient | null = null;

if (supabaseUrl && supabaseAnonKey) {
  try {
    client = createClient(supabaseUrl, supabaseAnonKey);
  } catch (e) {
    console.warn('Supabase client init error, falling back to local storage:', e);
  }
}

export const supabase = client;

// Local storage key for persistent orders
const LOCAL_STORAGE_KEY = 'zinachi_nam_orders_v1';

export function getLocalOrders(): CustomerOrder[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveLocalOrder(order: CustomerOrder): CustomerOrder[] {
  const orders = getLocalOrders();
  // Prevent duplicate ID insertion
  const exists = orders.some(o => o.id === order.id);
  const updated = exists ? orders.map(o => o.id === order.id ? order : o) : [order, ...orders];
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save order to localStorage:', e);
  }
  return updated;
}

export function updateLocalOrderStatus(orderId: string, status: CustomerOrder['status']): CustomerOrder[] {
  const orders = getLocalOrders();
  const updated = orders.map(o => o.id === orderId ? { ...o, status } : o);
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to update order status in localStorage:', e);
  }
  return updated;
}
