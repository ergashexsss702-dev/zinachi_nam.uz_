# ZINACHI_NAM.UZ — Professional Woodworking Full-Stack Platform

A bespoke, production-ready full-stack web application designed for **ZINACHI_NAM.UZ**, an artisanal woodworking workshop based in Namangan, Uzbekistan. Specializing in luxury custom wooden staircases, interior MDF doors, and strictly authentic Namangan-style traditional wooden coffins.

---

## 🌟 Key Highlights & Architecture

- **Luxury Design Constitution**: Walnut timber accents, warm stone tones, Playfair Display & Plus Jakarta Sans typography, dark & light mode, zero-pill discipline, smooth interactions.
- **Customer Staircase Portfolio**: Real portfolio imagery integrated throughout the catalogue and showcase.
- **Interactive Questionnaires**:
  - **ZINA (Staircases)**: 12 models catalogue, 6-step questionnaire (Design, Timber [Yong‘oq, Qarag‘ay, Rossiya daraxti], 12 Colors [Select 2], Address, International Phone, Customer Name).
  - **MDF ESHIKLAR (MDF Doors)**: 12 designs catalogue, 8-step questionnaire (Design, Coating/Material, 2 Colors, Dimensions, Quantity, Full Name, Address, International Phone).
  - **TOBUTLAR (Faqat Namangancha)**: Strict cultural compliance with verified Namangan traditional models only, dignified layout, strict placeholder policy, and 7-step order questionnaire.
- **International Phone Number Validation**: Powered by `libphonenumber-js` with searchable country codes, dial flags, and instant validation feedback.
- **Multilingual Support (11 Languages)**: Uzbek (Default), Russian, English, Turkish, Arabic (with native `dir="rtl"` support), Chinese, Korean, Japanese, German, French, Spanish.
- **Telegram Order System**: Direct forwarding of all orders to Administrator `@ergashexsss7o2` via Telegram Bot API with instant one-click chat fallback.
- **Admin Dashboard**: Protected administrator console for order tracking, status updating (`Yangi` ➔ `Qabul qilindi` ➔ `Jarayonda` ➔ `Tayyor` ➔ `Yetkazildi` ➔ `Bekor qilindi`), customer lookups, new design registration, and CSV export.
- **Supabase PostgreSQL & Local Resilience**: Full schema provided in `/supabase/schema.sql` with Row Level Security (RLS) and automatic client fallback so the site never crashes.

---

## 🚀 Environment Variables

Copy `.env.example` to `.env`:

```bash
# Telegram Bot Integration (Optional but recommended for automatic bot delivery)
TELEGRAM_BOT_TOKEN="your_telegram_bot_token"
TELEGRAM_CHAT_ID="your_telegram_chat_id"

# Supabase Cloud Database (Optional for cloud storage; local fallback active)
VITE_SUPABASE_URL="https://your-project.supabase.co"
VITE_SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_URL="https://your-project.supabase.co"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
```

---

## 🛠 Local Development & Commands

```bash
# Install dependencies
npm install

# Run full-stack dev server (Express + Vite on port 3000)
npm run dev

# Build for production
npm run build

# Start production server
npm run start
```

---

## 📞 Workshop Contact Details

- **Brand**: ZINACHI_NAM.UZ
- **Master Admin Call**: `+998 97 943 75 77`
- **Instagram**: `@zinachi_nam.uz` (https://www.instagram.com/zinachi_nam.uz/)
- **Telegram Administrator**: `@ergashexsss7o2` (https://t.me/ergashexsss7o2)
- **Location**: Namangan, Uzbekistan
