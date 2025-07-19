# 🛒 RandoStore - Turborepo Marketplace

A modern full-stack marketplace built with Turborepo monorepo — buy and sell random treasures!

---

## 🚀 What's Inside?

| App       | Tech                 | Purpose                    |
| --------- | -------------------- | -------------------------- |
| 🌐 Web    | Next.js + TypeScript | Desktop/mobile browser app |
| 📱 Mobile | React Native + Expo  | iOS/Android native app     |
| 🔧 API    | Express.js           | Backend server             |
| 📦 Types  | TypeScript           | Shared type definitions    |

---

## ⚡ Quick Start

```bash
#install
pnpm install

# Start everything
pnpm dev

```

### URLs

- **Web**: http://localhost:3000
- **API**: http://localhost:3001 ----- https://product-box-assessment-backend.vercel.app
- **Mobile**: Expo dev server

---

## 🏗️ Turborepo Structure

```
root/
├── apps/
│   ├── frontend/    # Next.js web app
│   ├── backend/     # Express API
│   └── mobile/      # React Native app
├── packages/
│   └── types/       # Shared TypeScript types
└── turbo.json       # Turborepo config
```

---

## 🎯 Key Features

### Web App

- ✅ Browse items & shopping cart with add/remove/update-quantity controls
- ✅ Responsive layout & dark/light theme (shadcn/ui)
- ✅ Zod-validated Shadcn modal for **creating** and **editing** items
- ✅ Delete items from grid or detail view
- ✅ Checkout flow
- ✅ Persistence via Zustand State Management

### Mobile App

- ✅ Native iOS/Android (Expo Router)
- ✅ Inline add/remove/update-quantity controls in list
- ✅ Item detail & edit screens via modal/page routes
- ✅ Checkout page with footer buttons & order summary
- ✅ Persistence via Zustand State Management

### Backend

- ✅ Serve The Images From The Backend
- ✅ CORS enabled

---

## 🧩 Tech Stack

- **Monorepo:** Turborepo + pnpm workspaces
- **Frontend:** Next.js 15 + Tailwind CSS + shadcn/ui + Zustand
- **Mobile:** React Native + Expo Router + Zustand
- **Backend:** Express.js + Node.js
- **Types:** TypeScript project references

## 🎯 Why Turborepo?

- ⚡ Fast builds with intelligent caching
- 🔄 Shared code across web, mobile & API
- 📦 Unified dependencies with pnpm workspaces
- 🎯 Build only what changed

---
