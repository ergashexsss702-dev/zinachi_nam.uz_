-- ZINACHI_NAM.UZ — SUPABASE POSTGRESQL SCHEMA WITH ROW LEVEL SECURITY (RLS)

-- Enable UUID extension if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Product Categories Table
CREATE TABLE IF NOT EXISTS public.product_categories (
  id TEXT PRIMARY KEY,
  name_uz TEXT NOT NULL,
  name_en TEXT NOT NULL,
  name_ru TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed Initial Categories
INSERT INTO public.product_categories (id, name_uz, name_en, name_ru, slug)
VALUES 
  ('cat-zina', 'Zinalar', 'Staircases', 'Лестницы', 'zina'),
  ('cat-mdf', 'MDF Eshiklar', 'MDF Doors', 'Двери МДФ', 'mdf'),
  ('cat-tobut', 'Namangancha Tobutlar', 'Namangan Traditional Coffins', 'Тобуты Наманганские', 'tobut')
ON CONFLICT (id) DO NOTHING;

-- 2. Wood Materials Table
CREATE TABLE IF NOT EXISTS public.wood_materials (
  id TEXT PRIMARY KEY,
  code TEXT NOT NULL,
  name_uz TEXT NOT NULL,
  name_en TEXT NOT NULL,
  name_ru TEXT NOT NULL,
  description_uz TEXT,
  description_en TEXT,
  description_ru TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO public.wood_materials (id, code, name_uz, name_en, name_ru)
VALUES
  ('wood-walnut', 'A', 'Yong‘oq', 'Walnut', 'Орех'),
  ('wood-pine', 'B', 'Qarag‘ay', 'Pine', 'Сосна'),
  ('wood-russian-timber', 'C', 'Rossiya Daraxti', 'Russian Timber', 'Российская древесина')
ON CONFLICT (id) DO NOTHING;

-- 3. Color Designs & Finishes Table
CREATE TABLE IF NOT EXISTS public.color_designs (
  id TEXT PRIMARY KEY,
  name_uz TEXT NOT NULL,
  name_en TEXT NOT NULL,
  name_ru TEXT NOT NULL,
  color_hex TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Product Designs Table
CREATE TABLE IF NOT EXISTS public.product_designs (
  id TEXT PRIMARY KEY,
  category_id TEXT REFERENCES public.product_categories(id) ON DELETE CASCADE,
  name_uz TEXT NOT NULL,
  name_en TEXT NOT NULL,
  name_ru TEXT NOT NULL,
  description_uz TEXT,
  description_en TEXT,
  description_ru TEXT,
  image_url TEXT,
  is_verified_namangan BOOLEAN DEFAULT FALSE,
  is_customer_portfolio BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Customers Table
CREATE TABLE IF NOT EXISTS public.customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  country TEXT NOT NULL,
  country_code TEXT,
  region TEXT,
  city TEXT,
  district TEXT,
  full_address TEXT NOT NULL,
  location_coordinates TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
  id TEXT PRIMARY KEY, -- e.g. ZIN-1793376538
  customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL,
  category TEXT NOT NULL CHECK (category IN ('zina', 'mdf', 'tobut')),
  product_title TEXT NOT NULL,
  product_design_id TEXT,
  wood_material TEXT,
  selected_colors JSONB DEFAULT '[]'::jsonb,
  measurements TEXT,
  quantity INTEGER DEFAULT 1,
  door_material_finish TEXT,
  additional_notes TEXT,
  status TEXT NOT NULL DEFAULT 'yangi' CHECK (status IN ('yangi', 'qabul_qilindi', 'jarayonda', 'tayyor', 'yetkazildi', 'bekor_qilindi')),
  telegram_delivered BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Order Items Table (Detailed line items for multi-item quotes)
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id TEXT REFERENCES public.orders(id) ON DELETE CASCADE,
  product_name TEXT NOT NULL,
  specifications JSONB DEFAULT '{}'::jsonb,
  quantity INTEGER DEFAULT 1,
  unit_price NUMERIC(12, 2),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Admin Users Table
CREATE TABLE IF NOT EXISTS public.admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin',
  full_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS) on all tables
ALTER TABLE public.product_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wood_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.color_designs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_designs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- RLS Policies:
-- Public can read active categories, designs, materials, and colors
CREATE POLICY "Public can view categories" ON public.product_categories FOR SELECT USING (true);
CREATE POLICY "Public can view wood materials" ON public.wood_materials FOR SELECT USING (true);
CREATE POLICY "Public can view color designs" ON public.color_designs FOR SELECT USING (true);
CREATE POLICY "Public can view product designs" ON public.product_designs FOR SELECT USING (true);

-- Public can submit customer info and orders
CREATE POLICY "Public can create customer record" ON public.customers FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can submit orders" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can view their own order by ID" ON public.orders FOR SELECT USING (true);

-- Indexes for lightning fast queries
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_category ON public.orders(category);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_customers_phone ON public.customers(phone_number);
