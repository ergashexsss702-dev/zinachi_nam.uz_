import React, { useState, useEffect, useMemo } from 'react';
import { CustomerOrder, OrderStatus, ProductCategory } from '../types';
import { getLocalOrders, updateLocalOrderStatus, saveLocalOrder } from '../lib/supabase';
import { generateDirectTelegramLink } from '../lib/telegram';
import {
  Shield,
  Lock,
  Search,
  Filter,
  Download,
  PlusCircle,
  ExternalLink,
  Phone,
  Send,
  CheckCircle,
  Clock,
  RefreshCw,
  LogOut,
  Eye,
  EyeOff,
  User,
  MapPin,
  Calendar,
  Layers,
  Check
} from 'lucide-react';

export const AdminView: React.FC = () => {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('zinachi_admin_auth') === 'true';
  });
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');

  // Orders and filters
  const [orders, setOrders] = useState<CustomerOrder[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | ProductCategory>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | OrderStatus>('all');
  const [selectedOrder, setSelectedOrder] = useState<CustomerOrder | null>(null);

  // New design / upload modal
  const [isAddDesignOpen, setIsAddDesignOpen] = useState(false);
  const [newDesignTitle, setNewDesignTitle] = useState('');
  const [newDesignCategory, setNewDesignCategory] = useState<ProductCategory>('zina');
  const [newDesignDesc, setNewDesignDesc] = useState('');
  const [newDesignImage, setNewDesignImage] = useState('');
  const [designAddedSuccess, setDesignAddedSuccess] = useState(false);

  // Fetch orders from server + merge with local
  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/orders');
      if (res.ok) {
        const data = await res.json();
        const serverOrders: CustomerOrder[] = data.orders || [];
        const localOrders = getLocalOrders();

        // Merge without duplicates
        const map = new Map<string, CustomerOrder>();
        serverOrders.forEach(o => map.set(o.id, o));
        localOrders.forEach(o => {
          if (!map.has(o.id)) map.set(o.id, o);
        });

        const merged = Array.from(map.values()).sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setOrders(merged);
      } else {
        setOrders(getLocalOrders());
      }
    } catch {
      setOrders(getLocalOrders());
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders();
    }
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Default authorized passcode for administrator (@ergashexsss7o2)
    if (passwordInput.trim() === 'admin702' || passwordInput.trim() === 'zinachi2026') {
      setIsAuthenticated(true);
      sessionStorage.setItem('zinachi_admin_auth', 'true');
      setAuthError('');
    } else {
      setAuthError('Noto‘g‘ri parol. Qayta urinib ko‘ring.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('zinachi_admin_auth');
  };

  // Status update
  const handleUpdateStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      }).catch(() => null);

      updateLocalOrderStatus(orderId, newStatus);

      setOrders(prev =>
        prev.map(o => (o.id === orderId ? { ...o, status: newStatus } : o))
      );

      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }
    } catch (err) {
      console.error('Failed to update order status:', err);
    }
  };

  // Export orders to CSV
  const handleExportCSV = () => {
    if (orders.length === 0) return;

    const headers = [
      'Order ID',
      'Category',
      'Product Title',
      'Customer Name',
      'Phone Number',
      'Country',
      'Region',
      'City',
      'District',
      'Full Address',
      'Wood Material',
      'Colors',
      'Measurements',
      'Quantity',
      'Status',
      'Telegram Delivered',
      'Created At',
    ];

    const rows = orders.map(o => [
      `"${o.id}"`,
      `"${o.category}"`,
      `"${(o.productTitle || '').replace(/"/g, '""')}"`,
      `"${(o.customerName || '').replace(/"/g, '""')}"`,
      `"${o.phoneNumber}"`,
      `"${o.country || ''}"`,
      `"${o.region || ''}"`,
      `"${o.city || ''}"`,
      `"${o.district || ''}"`,
      `"${(o.fullAddress || '').replace(/"/g, '""')}"`,
      `"${o.woodMaterial || ''}"`,
      `"${(o.selectedColors || []).join(', ')}"`,
      `"${(o.measurements || '').replace(/"/g, '""')}"`,
      `"${o.quantity || 1}"`,
      `"${o.status}"`,
      `"${o.telegramDelivered ? 'YES' : 'NO'}"`,
      `"${o.createdAt}"`,
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `zinachi_nam_orders_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Handle adding new design
  const handleCreateDesign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDesignTitle.trim()) return;

    setDesignAddedSuccess(true);
    setTimeout(() => {
      setIsAddDesignOpen(false);
      setDesignAddedSuccess(false);
      setNewDesignTitle('');
      setNewDesignDesc('');
      setNewDesignImage('');
    }, 1500);
  };

  // Filtered orders
  const filteredOrders = useMemo(() => {
    return orders.filter(o => {
      if (categoryFilter !== 'all' && o.category !== categoryFilter) return false;
      if (statusFilter !== 'all' && o.status !== statusFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = o.customerName.toLowerCase().includes(q);
        const matchesPhone = o.phoneNumber.toLowerCase().includes(q);
        const matchesId = o.id.toLowerCase().includes(q);
        const matchesProd = o.productTitle.toLowerCase().includes(q);
        return matchesName || matchesPhone || matchesId || matchesProd;
      }
      return true;
    });
  }, [orders, categoryFilter, statusFilter, searchQuery]);

  // If not logged in, render secure login card
  if (!isAuthenticated) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md bg-stone-900 border border-stone-800 rounded-2xl p-8 shadow-2xl text-stone-100">
          <div className="text-center mb-6">
            <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <Shield className="w-6 h-6 text-amber-500" />
            </div>
            <h2 className="text-2xl font-serif-luxury font-bold text-white">
              Admin Boshqaruv Paneli
            </h2>
            <p className="text-xs text-stone-400 mt-1">
              Faqat vakolatli ustaxona ma’muriyati uchun
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-stone-400 mb-1.5">
                Administrator Paroli
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="Parolni kiriting..."
                  required
                  className="w-full pl-3.5 pr-10 py-2.5 bg-stone-950 border border-stone-800 rounded-lg text-sm text-white focus:outline-none focus:border-amber-500"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {authError && (
              <p className="text-xs text-red-400 font-medium">{authError}</p>
            )}

            <button
              type="submit"
              className="w-full py-3 px-4 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors shadow-lg"
            >
              Tizimga kirish
            </button>

            <div className="pt-4 border-t border-stone-800 text-center">
              <span className="text-[11px] text-stone-500 font-mono">
                Bosh admin: @ergashexsss7o2 (standart parol: admin702)
              </span>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-stone-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-mono font-bold text-amber-500 uppercase tracking-wider">
              Administrator Boshqaruvi
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-white mt-1">
            Buyurtmalar va Mahsulotlar Boshqaruvi
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={fetchOrders}
            className="p-2.5 bg-stone-900 hover:bg-stone-800 text-stone-300 border border-stone-800 rounded-lg text-xs flex items-center gap-1.5 transition-colors"
            title="Yangilash"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Yangilash</span>
          </button>

          <button
            onClick={() => setIsAddDesignOpen(true)}
            className="px-3.5 py-2.5 bg-stone-900 hover:bg-stone-800 text-amber-400 border border-amber-500/30 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Yangi Dizayn Qo‘shish</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2.5 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-md"
          >
            <Download className="w-3.5 h-3.5" />
            <span>CSV Eksport</span>
          </button>

          <button
            onClick={handleLogout}
            className="p-2.5 bg-stone-900 hover:bg-red-950/40 text-stone-400 hover:text-red-400 border border-stone-800 rounded-lg text-xs transition-colors"
            title="Chiqish"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Filters and Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 p-4 bg-stone-900 border border-stone-800 rounded-2xl">
        {/* Search */}
        <div className="sm:col-span-6 relative">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buyurtmachi ismi, telefon, ID yoki mahsulot bo‘yicha qidirish..."
            className="w-full pl-9 pr-3.5 py-2 bg-stone-950 border border-stone-800 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500"
          />
        </div>

        {/* Category Filter */}
        <div className="sm:col-span-3">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value as any)}
            className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-lg text-xs text-stone-200 focus:outline-none focus:border-amber-500"
          >
            <option value="all">Barcha Bo‘limlar</option>
            <option value="zina">Zinalar (12 ta model)</option>
            <option value="mdf">MDF Eshiklar (12 ta model)</option>
            <option value="tobut">Tobutlar (Faqat Namangan)</option>
          </select>
        </div>

        {/* Status Filter */}
        <div className="sm:col-span-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-lg text-xs text-stone-200 focus:outline-none focus:border-amber-500"
          >
            <option value="all">Barcha Holatlar</option>
            <option value="yangi">Yangi</option>
            <option value="qabul_qilindi">Qabul qilindi</option>
            <option value="jarayonda">Jarayonda</option>
            <option value="tayyor">Tayyor</option>
            <option value="yetkazildi">Yetkazildi</option>
            <option value="bekor_qilindi">Bekor qilindi</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-950 border-b border-stone-800 text-[11px] uppercase tracking-wider text-stone-400 font-mono">
              <tr>
                <th className="px-4 py-3.5">ID & Sana</th>
                <th className="px-4 py-3.5">Bo‘lim & Mahsulot</th>
                <th className="px-4 py-3.5">Mijoz Ma’lumoti</th>
                <th className="px-4 py-3.5">Manzil</th>
                <th className="px-4 py-3.5">Holat</th>
                <th className="px-4 py-3.5">Telegram</th>
                <th className="px-4 py-3.5 text-right">Amallar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800/60">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-stone-500">
                    Buyurtmalar topilmadi.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((o) => {
                  const directTg = generateDirectTelegramLink(o);
                  return (
                    <tr
                      key={o.id}
                      className="hover:bg-stone-800/40 transition-colors cursor-pointer"
                      onClick={() => setSelectedOrder(o)}
                    >
                      {/* ID & Date */}
                      <td className="px-4 py-3.5 font-mono">
                        <span className="font-bold text-amber-400 block">{o.id}</span>
                        <span className="text-[10px] text-stone-500">
                          {new Date(o.createdAt).toLocaleDateString('uz-UZ')}
                        </span>
                      </td>

                      {/* Product */}
                      <td className="px-4 py-3.5">
                        <span className="text-xs uppercase font-semibold text-stone-400 block font-mono">
                          {o.category}
                        </span>
                        <span className="font-medium text-white">{o.productTitle}</span>
                        {o.woodMaterial && (
                          <span className="text-[11px] text-stone-400 block">
                            Daraxt: {o.woodMaterial}
                          </span>
                        )}
                      </td>

                      {/* Customer */}
                      <td className="px-4 py-3.5">
                        <span className="font-medium text-white block">{o.customerName}</span>
                        <span className="font-mono text-amber-400">{o.phoneNumber}</span>
                      </td>

                      {/* Location */}
                      <td className="px-4 py-3.5 max-w-[180px]">
                        <span className="text-stone-300 truncate block">
                          {[o.region, o.city, o.district, o.fullAddress].filter(Boolean).join(', ')}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3.5" onClick={(e) => e.stopPropagation()}>
                        <select
                          value={o.status}
                          onChange={(e) => handleUpdateStatus(o.id, e.target.value as OrderStatus)}
                          className={`px-2 py-1 rounded text-[11px] font-semibold border ${
                            o.status === 'yangi'
                              ? 'bg-amber-950/60 border-amber-800 text-amber-400'
                              : o.status === 'jarayonda'
                              ? 'bg-blue-950/60 border-blue-800 text-blue-400'
                              : o.status === 'tayyor'
                              ? 'bg-emerald-950/60 border-emerald-800 text-emerald-400'
                              : o.status === 'yetkazildi'
                              ? 'bg-stone-800 border-stone-700 text-stone-300'
                              : 'bg-stone-900 border-stone-800 text-stone-400'
                          }`}
                        >
                          <option value="yangi">Yangi</option>
                          <option value="qabul_qilindi">Qabul qilindi</option>
                          <option value="jarayonda">Jarayonda</option>
                          <option value="tayyor">Tayyor</option>
                          <option value="yetkazildi">Yetkazildi</option>
                          <option value="bekor_qilindi">Bekor qilindi</option>
                        </select>
                      </td>

                      {/* Telegram status */}
                      <td className="px-4 py-3.5">
                        {o.telegramDelivered ? (
                          <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
                            <Check className="w-3 h-3" /> Yuborilgan
                          </span>
                        ) : (
                          <span className="text-[11px] text-stone-500">Mahalliy saqlangan</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3.5 text-right space-x-1" onClick={(e) => e.stopPropagation()}>
                        <a
                          href={`tel:${o.phoneNumber.replace(/[^\d+]/g, '')}`}
                          className="p-1.5 inline-block text-stone-400 hover:text-amber-400 hover:bg-stone-800 rounded transition-colors"
                          title="Qo‘ng‘iroq qilish"
                        >
                          <Phone className="w-3.5 h-3.5" />
                        </a>
                        <a
                          href={directTg}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 inline-block text-stone-400 hover:text-sky-400 hover:bg-stone-800 rounded transition-colors"
                          title="Telegram orqali xabar yuborish"
                        >
                          <Send className="w-3.5 h-3.5" />
                        </a>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Selected Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in text-stone-100">
          <div className="relative w-full max-w-xl bg-stone-900 border border-stone-800 rounded-2xl p-6 max-h-[85vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-stone-800">
              <div>
                <span className="text-[10px] font-mono text-stone-500 uppercase">Buyurtma tafsiloti</span>
                <h3 className="text-xl font-bold font-mono text-amber-400">{selectedOrder.id}</h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 py-4 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3 bg-stone-950 rounded-xl border border-stone-800">
                <div>
                  <span className="text-stone-500 block">Bo‘lim:</span>
                  <span className="font-semibold text-white uppercase font-mono">{selectedOrder.category}</span>
                </div>
                <div>
                  <span className="text-stone-500 block">Sana:</span>
                  <span className="font-semibold text-white">{new Date(selectedOrder.createdAt).toLocaleString('uz-UZ')}</span>
                </div>
                <div>
                  <span className="text-stone-500 block">Mahsulot nomi:</span>
                  <span className="font-semibold text-amber-400">{selectedOrder.productTitle}</span>
                </div>
                <div>
                  <span className="text-stone-500 block">Daraxt turi:</span>
                  <span className="font-semibold text-white">{selectedOrder.woodMaterial || 'Standart'}</span>
                </div>
              </div>

              <div className="p-3 bg-stone-950 rounded-xl border border-stone-800 space-y-2">
                <span className="text-stone-500 block font-semibold">Buyurtmachi ma’lumotlari:</span>
                <div className="flex items-center gap-2">
                  <User className="w-3.5 h-3.5 text-stone-400" />
                  <span className="font-medium text-white">{selectedOrder.customerName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-stone-400" />
                  <a href={`tel:${selectedOrder.phoneNumber}`} className="font-mono text-amber-400 hover:underline">
                    {selectedOrder.phoneNumber}
                  </a>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0 mt-0.5" />
                  <span className="text-stone-300">
                    {[selectedOrder.country, selectedOrder.region, selectedOrder.city, selectedOrder.district, selectedOrder.fullAddress].filter(Boolean).join(', ')}
                  </span>
                </div>
              </div>

              {selectedOrder.selectedColors?.length > 0 && (
                <div>
                  <span className="text-stone-500 block">Tanlangan rang va dizayn:</span>
                  <span className="font-semibold text-amber-400">{selectedOrder.selectedColors.join(', ')}</span>
                </div>
              )}

              {selectedOrder.measurements && (
                <div>
                  <span className="text-stone-500 block">O‘lchamlar:</span>
                  <span className="font-mono text-stone-200">{selectedOrder.measurements}</span>
                </div>
              )}

              {selectedOrder.additionalNotes && (
                <div>
                  <span className="text-stone-500 block">Qo‘shimcha izoh:</span>
                  <span className="text-stone-300 italic">{selectedOrder.additionalNotes}</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3 pt-4 border-t border-stone-800">
              <a
                href={generateDirectTelegramLink(selectedOrder)}
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-2.5 px-4 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Mijoz bilan Telegramda ochish</span>
              </a>
              <button
                onClick={() => setSelectedOrder(null)}
                className="py-2.5 px-4 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-xl text-xs"
              >
                Yopish
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add New Design Modal */}
      {isAddDesignOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in text-stone-100">
          <div className="relative w-full max-w-md bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-1">Yangi Mahsulot Dizaynini Qo‘shish</h3>
            <p className="text-xs text-stone-400 mb-4">
              Zina, MDF eshik yoki tasdiqlangan Namangan tobuti fotosuratini biriktiring
            </p>

            {designAddedSuccess ? (
              <div className="p-6 text-center text-emerald-400 space-y-2">
                <CheckCircle className="w-10 h-10 mx-auto" />
                <div className="font-bold text-white">Yangi mahsulot saqlandi!</div>
              </div>
            ) : (
              <form onSubmit={handleCreateDesign} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-stone-400 mb-1">Toifasi *</label>
                  <select
                    value={newDesignCategory}
                    onChange={(e) => setNewDesignCategory(e.target.value as any)}
                    className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-lg text-xs text-white"
                  >
                    <option value="zina">Zina (Staircase)</option>
                    <option value="mdf">MDF Eshik (MDF Door)</option>
                    <option value="tobut">Namangan Tobuti (Verified Coffin)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-400 mb-1">Dizayn nomi *</label>
                  <input
                    type="text"
                    value={newDesignTitle}
                    onChange={(e) => setNewDesignTitle(e.target.value)}
                    required
                    placeholder="Masalan: Imperator O‘ymakor Zina"
                    className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-lg text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-400 mb-1">Tavsifi</label>
                  <textarea
                    rows={2}
                    value={newDesignDesc}
                    onChange={(e) => setNewDesignDesc(e.target.value)}
                    placeholder="Yog‘och toifalari, afzalliklari..."
                    className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-lg text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-400 mb-1">
                    Fotosurat fayli yoki URL manzili
                  </label>
                  <input
                    type="text"
                    value={newDesignImage}
                    onChange={(e) => setNewDesignImage(e.target.value)}
                    placeholder="/src/assets/images/... yoki URL"
                    className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-lg text-xs text-white font-mono"
                  />
                </div>

                <div className="flex gap-2.5 pt-2">
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-xl"
                  >
                    Saqlash
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAddDesignOpen(false)}
                    className="py-2.5 px-4 bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs rounded-xl"
                  >
                    Bekor qilish
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
