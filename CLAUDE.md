# CLAUDE.md

## Project Overview

Vecindad is a neighborhood marketplace for verified residents of Nordelta (Argentina). Users buy/sell items and offer services exclusively to verified neighbors, with a trust-based verification system.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4 + PostCSS
- **Backend**: Firebase (Firestore, Storage, Auth)
- **Auth**: Google OAuth via Firebase
- **Analytics**: PostHog
- **PWA**: next-pwa

## Commands

```bash
npm run dev      # Start dev server
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Project Structure

```
app/                  # Next.js App Router pages
  auth/               # Google OAuth signup + registration
  feed/               # Marketplace listing grid with filters
  publish/            # Create listing form
  listing/[id]/       # Listing detail page
  profile/            # User profile & public profile views
  profile/[uid]/      # Public profile with vouch button
  admin/              # Admin dashboard (approve/suspend users)
  invite/             # Invite link creation & acceptance
  invite/[token]/     # Invite acceptance flow
components/           # Shared UI components (NavBar)
constants/            # Category labels/icons, neighborhood data
hooks/                # useAuth (auth context), useTrustSignal (stub)
lib/                  # Core logic modules
  firebase.ts         # Firebase initialization
  auth.ts             # Google OAuth sign-in/sign-out
  firestore.ts        # User, listing, admin, validation CRUD
  trust.ts            # Trust score computation & permission checks
  storage.ts          # Firebase Storage photo upload
  analytics.ts        # PostHog event tracking
  invites.ts          # Invite system (stub)
  socialGraph.ts      # Social graph queries (stub)
types/                # TypeScript domain models
scripts/              # PWA icon generation
```

## Key Concepts

### Trust System
Users earn trust through verifications and peer vouches:
- **Levels**: unverified (0) → basic (1-39) → verified (40-69) → trusted (70-100)
- **Verifications**: neighborhood declaration, DNI, Google OAuth, peer vouching, etc.
- **Permissions**: Publishing requires active status + trust > 0; vouching requires verified+; inviting requires verified+

### Domain Models
Defined in `types/index.ts`: User, Listing, Verification, TrustLevel, Neighborhood, Category, Invite, SocialGraphEdge, Validation.

## Environment Variables

Required Firebase config (`NEXT_PUBLIC_FIREBASE_*`), plus:
- `NEXT_PUBLIC_POSTHOG_KEY` - Analytics
- `NEXT_PUBLIC_ADMIN_UID` - Admin user identifier
- `NEXT_PUBLIC_APP_URL` - App base URL
- `NEXT_PUBLIC_INVITE_EXPIRY_HOURS` - Invite link TTL (default 48)

## Design System

Material Design 3 tokens with custom palette:
- **Primary** (Deep Indigo #162459): Trust, main actions
- **Secondary** (Earthy Green #3f6833): Community, verification
- **Tertiary** (Warm Earth #431e00): Accents, pending states
- **Font**: Plus Jakarta Sans
- **Icons**: Material Symbols Outlined

## Conventions

- Pages use `"use client"` directive (client-side rendering with Firebase)
- Auth state managed via React Context (`hooks/useAuth.tsx`)
- Firestore is the single source of truth for users, listings, and validations
- WhatsApp is the primary communication channel between buyers and sellers
- All analytics events are defined in `types/index.ts` (AnalyticsEvent type)
