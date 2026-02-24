# Blue Flame - Medical Cannabis Cultivator & Private Members Club

## Overview
Mobile app for Blue Flame South African Medical Cannabis Cultivator & Private Members Club. A genetics-first cultivation strategy focused on preserving, stabilizing, and documenting elite medical cannabis lineages.

## Tech Stack
- **Frontend**: Expo React Native with Expo Router (file-based routing)
- **Backend**: Express.js on port 5000
- **State Management**: AsyncStorage for local persistence, React Context for shared state
- **UI**: Custom dark theme with Inter font family, blue flame accent colors

## Project Architecture

### App Routes
- `app/(tabs)/` - Main tab navigation (Home, Catalog, Strains, Blog, Profile)
- `app/(auth)/` - Modal auth flow (Login, Register)
- `app/strain/[id]` - Strain detail page
- `app/product/[id]` - Product detail page
- `app/blog/[id]` - Blog article with comments
- `app/cart` - Shopping cart modal
- `app/checkout` - Checkout flow

### Key Files
- `constants/colors.ts` - Dark theme color palette
- `lib/auth-context.tsx` - Authentication context (AsyncStorage-backed)
- `lib/cart-context.tsx` - Cart & orders context
- `lib/data-store.ts` - Seed data for strains, products, blog posts + AsyncStorage helpers
- `lib/query-client.ts` - React Query client with API helpers

### Features
1. **Member Authentication** - Login/registration with AsyncStorage persistence
2. **Product Catalog** - Filterable product grid with categories
3. **Strain Database** - Comprehensive genetics library with lineage, terpenes, medical uses
4. **Blog/Forum** - Articles with member comments
5. **Cart & Checkout** - Full shopping cart with order placement
6. **Member Profile** - Account info, order history, membership tier

### Design
- Dark premium aesthetic (#0A0A0F background)
- Blue accent (#3B82F6) with amber/orange flame highlights (#F59E0B)
- Inter font family (400, 500, 600, 700 weights)
- iOS 26 liquid glass tab support via NativeTabs

## Recent Changes
- Initial build: Full app with all features implemented
