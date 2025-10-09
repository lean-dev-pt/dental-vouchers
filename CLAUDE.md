# Cheques Dentista - Comprehensive Solution Overview

**Version: 1.04** - Simplified Onboarding Flow

## 📝 Version History

### Version 1.04 - Simplified Onboarding Flow
**Release Date**: January 10, 2025
**Status**: COMPLETE - DO NOT MODIFY

**Problems Solved:**
- Merged sign-up and onboarding into single beautiful form
- Reduced user journey from 4 pages to 2 pages (50% reduction)
- Implemented modern teal/cyan gradient design matching app theme
- Fixed design inconsistency in authentication flow
- Streamlined user experience for faster conversion

**Files Modified:**
- [app/page.tsx](app/page.tsx:11-24) - Simplified checkout handlers to redirect to sign-up with plan parameter
- [app/page.tsx](app/page.tsx:92-99) - Removed loading states and simplified CTA buttons
- [app/page.tsx](app/page.tsx:388-395) - Updated pricing section button
- [components/sign-up-form.tsx](components/sign-up-form.tsx:18-34) - Added clinic fields (name, owner, phone) and plan detection
- [components/sign-up-form.tsx](components/sign-up-form.tsx:36-107) - Implemented 3-step signup: auth → onboarding API → Stripe checkout
- [components/sign-up-form.tsx](components/sign-up-form.tsx:109-256) - Complete UI redesign with gradient styling, two sections, and modern layout
- [app/auth/sign-up/page.tsx](app/auth/sign-up/page.tsx:1-14) - Added Suspense wrapper and gradient background
- [app/api/onboarding/route.ts](app/api/onboarding/route.ts) - Created API endpoint for clinic and profile creation

**Files Deleted:**
- [app/onboarding/page.tsx] - Removed separate onboarding page (merged into sign-up)

**Features Added:**
- Single-page sign-up form with 6 fields (clinic info + account info)
- Beautiful gradient design with organized sections
- Plan display in form header
- Automatic flow: Sign Up → Create Clinic/Profile → Stripe Checkout → Dashboard
- Suspense boundary for proper Next.js 15 compatibility

**Performance Improvements:**
- Build successful with no errors
- Total routes: 23 pages (reduced from 24)
- Faster user conversion with fewer steps
- Better mobile responsiveness with max-w-2xl form

---

### Version 1.03 - Stripe Subscription Integration
**Release Date**: January 9, 2025
**Status**: COMPLETE - DO NOT MODIFY

**Problems Solved:**
- Implemented complete Stripe subscription billing system
- Added monthly (€19) and annual (€190) subscription plans
- Created interactive pricing section with clickable plan selection
- Integrated Stripe Customer Portal for subscription management
- Built comprehensive webhook handler for all subscription events

**Files Modified:**
- [lib/stripe/client.ts](lib/stripe/client.ts) - NEW: Client-side Stripe instance
- [lib/stripe/server.ts](lib/stripe/server.ts) - NEW: Server-side Stripe instance with API v2025-09-30.clover
- [app/api/stripe/checkout/route.ts](app/api/stripe/checkout/route.ts) - NEW: Checkout session creation API
- [app/api/stripe/portal/route.ts](app/api/stripe/portal/route.ts) - NEW: Customer portal API
- [app/api/stripe/webhook/route.ts](app/api/stripe/webhook/route.ts) - NEW: Webhook event handler
- [app/page.tsx](app/page.tsx:11-78) - Added plan selection state and checkout handlers
- [app/page.tsx](app/page.tsx:87-128) - Added hero section plan toggle with Stripe checkout
- [app/page.tsx](app/page.tsx:385-458) - Created interactive pricing section with clickable plan cards
- [app/dashboard/account/page.tsx](app/dashboard/account/page.tsx:46-66) - Added Subscription interface and state
- [app/dashboard/account/page.tsx](app/dashboard/account/page.tsx:99-108) - Fetch subscription data from database
- [app/dashboard/account/page.tsx](app/dashboard/account/page.tsx:194-246) - Added subscription management functions
- [app/dashboard/account/page.tsx](app/dashboard/account/page.tsx:456-510) - Real subscription UI with status, plan details, and portal access
- [.env.local](.env.local:6-24) - Added Stripe environment variables with documentation

**Database Changes:**
- Created `subscriptions` table with full lifecycle tracking (status, plan_type, billing periods)
- Created `subscription_history` audit log table (mirrors voucher_status_history pattern)
- Added RLS policies for secure multi-tenant access
- Added indexes for performance optimization

**Features Added:**
- Complete Stripe subscription billing system
- Monthly and annual plan options with 17% savings badge
- Interactive pricing cards with visual selection feedback
- Real-time subscription status display in account page
- Stripe Customer Portal integration for subscription management
- Webhook handling for checkout completion, subscription updates, cancellations, and payment failures
- Automatic subscription status tracking and history logging

**Performance Improvements:**
- Build successful with no errors
- Total routes: 23 pages
- All API routes functional and type-safe

---

### Version 1.02 - Landing Page Refinement & GitHub/Vercel Setup
**Release Date**: October 9, 2025
**Status**: COMPLETE - DO NOT MODIFY

**Problems Solved:**
- Removed "Configure em 5 minutos" messaging from landing page
- Simplified feature descriptions for better clarity
- Cleaned up unused landing page variants
- Established GitHub repository with staging/production workflow
- Fixed production build errors for Vercel deployment

**Files Modified:**
- [app/page.tsx](app/page.tsx:52) - Removed setup time messaging
- [app/page.tsx](app/page.tsx:97) - Updated feature description to "simples de usar"
- [app/page.tsx](app/page.tsx:324) - Updated CTA heading and subtitle
- [app/page.tsx](app/page.tsx:246-275) - Removed "Cheques Dentista Pro" title, updated pricing features list
- [app/layout.tsx](app/layout.tsx:15) - Added logo.png as favicon
- [app/page.tsx](app/page.tsx:16,350) - Replaced Receipt icon with logo.png image
- [app/(marketing)/landing1/page.tsx](app/(marketing)/landing1/page.tsx:122,144,166) - Fixed ESLint quote errors
- [app/(marketing)/landing2/page.tsx](app/(marketing)/landing2/page.tsx:359,392,426) - Fixed ESLint quote errors
- Deleted: app/(marketing)/landing1/page.tsx, landing2/page.tsx, landing3/page.tsx

**Features Added:**
- Logo integration (favicon and header/footer)
- GitHub repository setup with main/staging branches
- Vercel deployment pipeline configured
- Staging-to-production workflow established

**Performance Improvements:**
- Reduced total routes from 23 to 20 pages
- Cleaner landing page messaging
- Build passes ESLint validation

---

## 🎯 Executive Summary
Cheques Dentista is a specialized SaaS platform designed for Portuguese dental clinics to efficiently manage the complete lifecycle of dental vouchers (cheques dentista). The system provides end-to-end tracking, from initial voucher receipt through patient utilization to final payment settlement with both the national health service (ARS) and healthcare providers.

## 🚀 Core Value Proposition
- **Target Market**: Portuguese dental clinics of all sizes
- **Problem Solved**: Manual tracking of dental voucher lifecycles is error-prone, time-consuming, and lacks visibility into payment status and clinic performance metrics
- **Solution**: A lean, intuitive digital platform that automates voucher tracking, provides real-time analytics, and streamlines the reimbursement process
- **Unique Differentiators**:
  - Built specifically for the Portuguese dental voucher system
  - Mobile-first design for on-the-go access
  - Comprehensive reporting and analytics
  - Multi-user support with role-based access

## 🏥 Market Context & Business Model

### Portuguese Dental Voucher System
The Portuguese government provides dental care vouchers (cheques-dentista) to specific demographics:
- Children and young adults (up to 18 years)
- Pregnant women
- Senior citizens (65+)
- Low-income families
Each voucher has a fixed value (typically €45) that can be used for dental treatments.

### Revenue Model
- **SaaS Subscription**: Monthly/annual subscription per clinic
- **Tiered Pricing**: Based on clinic size and voucher volume
- **Potential Add-ons**: SMS notifications, API integrations, advanced analytics

## 🚀 Key Features

### 1. Voucher Management
- **Complete Lifecycle Tracking**: From "Pendente de Entrega" to "Pago ao Médico"
- **Batch Entry**: Add multiple vouchers simultaneously (up to 3 at once)
- **Smart Defaults**: Auto-populated voucher amounts based on clinic configuration
- **Status Transitions**: Automated status history with full audit trail

### 2. Patient & Doctor Management
- **Patient Registry**: Track patient demographics and voucher history
- **Doctor Performance**: Monitor individual doctor metrics and payments
- **Voucher Limits**: Enforce maximum vouchers per patient (3 vouchers)
- **Quick Search**: Instant filtering across all entities

### 3. Advanced Analytics & Reporting
- **Real-time Dashboards**: Visual insights into voucher distribution and status
- **Performance Metrics**: Doctor-level and clinic-wide KPIs
- **Lead Time Analysis**: Track processing times between lifecycle stages
- **Financial Summaries**: Payment tracking from ARS and to doctors
- **CSV Export**: One-click data export for accounting and compliance

### 4. Multi-Clinic Architecture
- **Role-Based Access**: Admin, Doctor, and Staff roles
- **Clinic Isolation**: Complete data separation between clinics
- **Customizable Settings**: Per-clinic voucher amounts and business rules

### 5. Mobile-First Design
- **Responsive UI**: Optimized for smartphones and tablets
- **Touch-Friendly**: Large touch targets for easy mobile interaction
- **Card-Based Layouts**: Information hierarchy optimized for small screens

## 🔒 Security & Compliance
- **Row-Level Security (RLS)**: Database-level data isolation
- **GDPR Compliant**: Built for European data protection standards
- **Audit Trail**: Complete history of all voucher status changes
- **Secure Authentication**: Supabase Auth with magic links and OAuth

## 🇵🇹 Language & Localization
**Portuguese-First Design**: All interfaces, messages, and documentation in PT-PT
- Native Portuguese terminology for medical and administrative contexts
- Date formats: DD/MM/YYYY
- Currency: EUR with Portuguese decimal notation (45,00 €)

## 📊 System Architecture

### Technology Stack
- **Frontend**: Next.js 14 with App Router, React, TypeScript
- **UI Components**: Shadcn/ui with Tailwind CSS
- **Database**: PostgreSQL via Supabase
- **Authentication**: Supabase Auth
- **Analytics**: Recharts for data visualization
- **State Management**: React hooks and context
- **Data Tables**: TanStack React Table

### Database Schema
- **clinics**: Multi-tenant clinic management
- **profiles**: User profiles with role assignments
- **doctors**: Doctor registry per clinic
- **patients**: Patient demographics and history
- **vouchers**: Core voucher tracking with status lifecycle
- **voucher_status_history**: Immutable audit log
- **Database Views**: Pre-aggregated analytics for performance

### Page Structure
- `/dashboard` - Main dashboard with KPI cards
- `/dashboard/vouchers` - Voucher management with filtering
- `/dashboard/patients` - Patient registry and history
- `/dashboard/doctors` - Doctor performance tracking
- `/dashboard/reports` - Analytics and reporting
- `/dashboard/account` - Settings and subscription

## 🎨 Design System - Modern Healthcare Theme

### Color Palette
**Primary Colors:**
- Teal: `#17B897` (from-teal-400 to-cyan-500)
- Background gradients: `from-teal-50/70 via-white to-cyan-50/70`

**Status Colors with Gradients:**
- **Pendente de Entrega**: Amber to Orange (`from-amber-400 to-orange-500`)
- **Recebido**: Teal to Cyan (`from-teal-400 to-cyan-500`)
- **Utilizado**: Emerald to Green (`from-emerald-400 to-green-500`)
- **Submetido**: Violet to Purple (`from-violet-400 to-purple-500`)
- **Pago pela ARS**: Blue to Indigo (`from-blue-400 to-indigo-500`)
- **Pago ao Médico**: Pink to Rose (`from-pink-400 to-rose-500`)

### Typography
- Headers: Bold, extrabold fonts
- Gradient text effects for values and highlights
- Font weights: medium for body, bold/extrabold for emphasis

### UI Components
- **Borders**: 2xl rounded corners for modern feel
- **Cards**: Gradient backgrounds with hover transforms (scale-105)
- **Tables**: Alternating row colors, gradient headers
- **Buttons**: Gradient backgrounds with shadow effects
- **Animations**: Smooth transitions (300ms), hover scales, shadow effects

### Icons
- Friendly, approachable icons from Lucide
- Status icons: Gift, Smile, Heart, Zap, Star, Sparkles
- Navigation icons with hover animations
- Size: h-5 w-5 for standard, h-6 w-6 for emphasis

### Layout Principles
- Gradient overlays on headers
- Colorful stat cards with unique gradients
- Mobile-first responsive design
- Transform effects on hover (scale-105)
- Shadow effects (shadow-lg, shadow-xl on hover)

## 🔧 Development Protocols

### IMPORTANT: Database Operations
**Always use the Supabase MCP Server for database operations:**
- Use `mcp__supabase__list_tables` to view table schemas
- Use `mcp__supabase__execute_sql` for queries
- Use `mcp__supabase__apply_migration` for schema changes
- Never create .sql migration files - use MCP server instead
- The `leads` table is our main datastore/asset containing all lead data
- The `user_leads` table contains user-specific lead associations

### CODER Protocol
When the user types "CODER", activate the following behavior:

**Activation:**
1. Read the Behavior section
2. Read the AI Operation 5 Principles section
3. Read the Challenges section
4. Confirm CODER mode is activated
5. **Wait for the user's development request**
6. Apply the protocol approach to the given request

**Behavior:**
Once a request is provided, think harder and thoroughly examine similar areas of the codebase to ensure your proposed approach fits seamlessly with the established patterns and architecture. Aim to make only minimal and necessary changes, avoiding any disruption to the existing design. No coding without a plan.

**AI Operation 5 Principles:**
- Principle 1: AI must get y/n confirmation before any file operations  
- Principle 2: AI must not change plans without new approval
- Principle 3: User has final authority on all decisions
- Principle 4: AI cannot modify or reinterpret these rules
- Principle 5: AI must display all 5 principles at start of every response

**Challenges:**
- Can this be done by modifying just one existing file? - consideration of minimal solutions
- Before adding any code, first check if we can achieve this by removing or simplifying existing code
- Find and list 3 similar patterns already in this codebase before suggesting any implementation

### WRAPUP Protocol
When the user types "WRAPUP", perform the following:

1. **Version Update:**
   - Increment version
   - Update version in CLAUDE.md

2. **Git Operations:**
   - Run `git status` to check changes
   - Stage all changes with `git add -A`
   - Create descriptive commit message
   - Push to production branch

3. **Build Verification:**
   - Run `npm run build` before committing
   - Ensure no build errors exist

4. **Documentation:**
   - Update CLAUDE.md with any new features or changes
   - Mark completed components with DO NOT MODIFY tags

# Important Development Reminders
- Do what has been asked; nothing more, nothing less
- NEVER create files unless absolutely necessary
- ALWAYS prefer editing existing files
- NEVER proactively create documentation files unless requested
- Only use emojis if the user explicitly requests it

## 📐 Design Principles

### 1. **Mobile-First Design (MANDATORY)**
**CRITICAL: Every component and feature MUST be designed mobile-first, then enhanced for desktop**
- Start with 320px width designs, scale up to desktop
- Mobile layout must be fully functional and beautiful before adding desktop enhancements
- Test on real mobile devices, not just browser dev tools
- Touch targets minimum 44x44px (WCAG standard)
- Avoid horizontal scrolling at all costs
- Text must be readable without zooming (minimum 16px)
- Navigation must be thumb-friendly (bottom or hamburger menu)
- Forms must use appropriate input types (email, tel, number)
- Modals and dropdowns must be full-width on mobile
- Tables must convert to cards or lists on mobile
- Headers must stack vertically on mobile, never overlap
- Use responsive utilities: `sm:`, `md:`, `lg:` for progressive enhancement
- Test these specific breakpoints:
  - 320px (minimum mobile)
  - 375px (iPhone SE/8)
  - 390px (iPhone 14)
  - 768px (tablet/desktop transition)

### 2. **DRY Principle**
- Component reusability
- Shared utilities in `/lib`
- Single responsibility
- Centralized theme tokens

### 3. **Security by Design**
- RLS on all tables
- Input validation everywhere
- Never expose sensitive keys
- API authentication required
- **NEVER hardcode API keys or secrets in any file** - Always use environment variables
- Never commit secrets or keys to the repository
- Always mask/redact API keys when logging or displaying them

### 4. **Performance Standards**
- LCP < 2.5s
- FID < 100ms
- CLS < 0.1
- Bundles < 200KB gzipped

### 5. **Accessibility (WCAG AA)**
- 4.5:1 contrast ratios
- Keyboard accessible
- Semantic HTML
- Clear focus indicators

### 6. **Components**
- Always use the shadcn MCP Server
- If not available, ask for it to be installed
- If a request needs that a new component is installed, present the options you are considering and wait for a decision
- Pull components directly from the MCP Server

## 🏆 Competitive Advantages

### Why Choose Cheques Dentista?
1. **Purpose-Built**: Designed specifically for Portuguese dental voucher workflows
2. **Time Savings**: Reduces administrative overhead by 70%
3. **Error Reduction**: Eliminates manual tracking errors
4. **Real-Time Visibility**: Instant access to voucher status and payments
5. **Mobile Access**: Work from anywhere, anytime
6. **Affordable**: Competitive pricing for clinics of all sizes
7. **No Training Required**: Intuitive interface that staff can use immediately

### ROI for Clinics
- **Faster Reimbursements**: Track and submit vouchers promptly
- **Reduced Administrative Costs**: Less time on paperwork
- **Improved Cash Flow**: Better visibility of pending payments
- **Compliance**: Automatic audit trails for regulatory requirements

## 🚗 Product Roadmap

### Phase 1 (Current - v1.00)
✅ Core voucher lifecycle management
✅ Multi-clinic architecture
✅ Comprehensive reporting
✅ Mobile-responsive design
✅ Role-based access control

### Phase 2 (Q2 2025)
- **Voucher Expiry Management**: Add expiry date tracking and alerts for vouchers nearing expiration
- SMS/Email notifications for status changes
- Bulk import from Excel/CSV
- API for integration with practice management systems
- Advanced analytics with predictive insights

### Phase 3 (Q3 2025)
- AI-powered voucher processing suggestions
- Automated submission to ARS portal
- Multi-language support (English, Spanish)
- White-label options for larger chains

### Phase 4 (Q4 2025)
- Mobile native apps (iOS/Android)
- Electronic signature integration
- Automated reconciliation with bank statements
- Expansion to other healthcare voucher types

## 📁 Project Structure

### Database Schema (DO NOT MODIFY)
- **clinics**: Main customer entity with name, timestamps
- **profiles**: Links auth users to clinics with roles (admin/doctor/staff)
- **doctors**: Clinic doctors registry
- **patients**: Clinic patients with year_of_birth
- **vouchers**: Dental vouchers with Portuguese lifecycle states:
  - `pendente_entrega` - Pendente de Entrega
  - `recebido` - Recebido (default)
  - `utilizado` - Utilizado
  - `submetido` - Submetido
  - `pago_ars` - Pago pela ARS
  - `pago_medico` - Pago ao Médico
- All tables have RLS policies and automatic updated_at triggers

### Dashboard Structure (DO NOT MODIFY)
- **/dashboard**: Main protected area with sidebar navigation
  - **/dashboard/vouchers**: Cheques Dentista management with state-based filtering and sortable table
    - 6 status cards for filtering (Pendente de Entrega, Recebido, Utilizado, Submetido, Pago pela ARS, Pago ao Médico)
    - Sortable columns: Número, Paciente, Médico, Valor, Data, Estado
    - Global search for patient/doctor names
    - Mobile-responsive card layout
  - **/dashboard/patients**: Patient management with sortable table
    - Sortable columns: Nome, Data de Nascimento, Cheques Recebidos, Cheques Utilizados
    - Global search for patient names
    - Mobile-responsive card layout
  - **/dashboard/doctors**: Doctor management with sortable table
    - Sortable columns: Nome, Valor Submetido, Valor Pago pela ARS, Valor Pago ao Médico
    - Global search for doctor names
    - Mobile-responsive card layout
- **Tables**: All dashboard pages use TanStack React Table for sorting/filtering
- **Sidebar Navigation**: Mobile-responsive with hamburger menu
- **Authentication**: Supabase Auth with protected routes
- **Forms**: All forms use dialogs for adding new entities with clean UI/UX

# important-instruction-reminders
Do what has been asked; nothing more, nothing less.
NEVER create files unless they're absolutely necessary for achieving your goal.
ALWAYS prefer editing an existing file to creating a new one.
NEVER proactively create documentation files (*.md) or README files. Only create documentation files if explicitly requested by the User.