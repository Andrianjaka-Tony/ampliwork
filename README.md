# Circuit Labs — Finance Dashboard

A full-stack financial dashboard that merges transactions from **Chase**, **Bank of America** and **Amex** into one normalized, multi-currency view, with role-based access control.

---

## 1. How to run

```bash
cd project
npm install
npm run dev
```

- App runs at `http://localhost:3000`
- Available scripts: `dev`, `build`, `start`, `lint`
- Login at `/login`. Test accounts (mock, from `data/users/user.json`):

| Email                        | Password              | Role         | Tabs                        |
| ---------------------------- | --------------------- | ------------ | --------------------------- |
| `alex.rivera@circuitlabs.io` | `CircuitAdmin2025!`   | admin        | Transactions, Stats, Custom |
| `priya.shah@circuitlabs.io`  | `CircuitFinance2025!` | finance_lead | Transactions, Stats, Custom |
| `marcus.chen@circuitlabs.io` | `CircuitAnalyst2025!` | analyst      | Stats                       |
| `jordan.lee@circuitlabs.io`  | `CircuitViewer2025!`  | viewer       | Transactions                |

---

## 2. Tech stack

- **Next.js 16** (App Router / RSC), **React 19**, **TypeScript** (strict)
- **Tailwind CSS v4** (inline config, `@tailwindcss/postcss`)
- **shadcn/ui** (new-york, neutral) + **Radix UI**
- **TanStack Query** for data fetching (chosen over SWR — allowed by the brief)
- **Zod** (validation + inferred types, zod-first approach)
- **Recharts** (via the shadcn chart component), **next-themes** (dark mode), **sonner** (toasts), **lucide-react**, **Geist** fonts

---

## 3. Architecture

- **Zod-first**: schemas are the source of truth, types are inferred (no `types/` folder)
- **Domain modules** under `src/lib/`: `api`, `auth`, `banks`, `money`, `transactions`, `stats`, `audit`, `users`, `csv`
- Each domain follows the same pattern: `*.schema` (zod) + `*.data` (server-side read/validation) + `*.service` (server logic) + `*.api` (client call) + `*.hooks` (TanStack)
- **Generalized API client** (`apiFetch`): every call goes through it and returns a typed envelope `{ ok, data } | { ok, error }`
- **Validation at the boundaries**: source JSON (banks, users, rates) is validated at server read time → no types that lie
- **Logic kept out of UI components** (normalization, RBAC, conversion all live in `lib/`)

---

## 4. What's implemented (per requirement)

- **Auth / RBAC**: `/login` + `POST /api/auth/login` (checked against `user.json`); `localStorage` stores `id` / `name` / `role` / `allowedTabs` (never the password); `/dashboard` guard redirects to `/login`; logout; RBAC driven by `allowedTabs` (tabs hidden + "Access denied" on direct access)
- **API routes**: 3 raw routes (return the JSON byte-for-byte); `/api/transactions` normalized + merged + filters + earliest-first sort by default; `/api/transactions/[id]`
- **Normalized model**: `id`, `date`, `description`, `amount`, `currency`, `type`, `category`, `vendor`, `bank`, `authorizedBy` (resolved user), `source` (raw)
- **Transactions tab**: 7-column table, Authorized By tooltip (initials / email / role), filters, currency conversion, detail modal (formatted bank data), CSV export (active filters), pagination (≤30/page), loading / empty states
- **Stats tab**: 2 KPIs (Net cash flow, Total cash out), 2 charts (Spend by category, Money in vs out by month), top vendors table, loading / empty states
- **Custom tab**: Spend Oversight (admin + finance_lead only)

---

## 5. Decisions & tradeoffs (the core)

- **Normalization**: the 3 banks use different field names _and_ different sign conventions (Chase = signed `amount`; BoA = positive + `debitCreditMemo`; Amex = `amountInCents` + `type`). → stored as a positive magnitude + a `type` for direction. `authorizedBy` is resolved by matching the name (case-insensitive) against `user.json`.
- **Multi-currency**: amounts are kept in their original currency; conversion happens on demand via `rates.json` (`amount × rate[from] / rate[to]`, USD base). "Show Currency In" is a display transform. Stats & Custom convert everything to USD before any math.
- **Everything server-side**: both filters _and_ pagination. The amount range is currency-aware (the server converts before comparing min/max, to match "Show Currency In").
- **Filters added by choice**: Type (debit/credit) and Amount range (min/max), beyond the brief — genuinely useful for a finance team.
- **Raw routes**: returned exactly as-is (the file's text, no envelope) to honor "exactly as-is"; the other routes use the `{ ok, data }` envelope.
- **Auth deliberately simple** (`localStorage`, no JWT/session — per the brief) but hardened where it's free: timing-safe password comparison, generic 401 (anti account-enumeration), password never returned.
- **Vendor dedup**: the same vendor appears with different casing across banks (`GUSTO PAYROLL` vs `Gusto Payroll`) → grouped case-insensitively for Stats/Custom, with a readable label.
- **`/api/transactions/[id]`** implemented (required), but the modal uses the `source` already embedded in the list (instant UX, no second call).

---

## 6. Custom tab — why "Spend Oversight"

- The tab is restricted to **admin + finance_lead** → built as a governance feature that justifies the restriction (sensitive data = leadership only)
- Two building blocks: (1) **out-of-norm transactions per category** (robust IQR fence: `Q3 + 1.5 × IQR`, in USD); (2) **authorization concentration** (who approved what share of spend)
- Original (does not duplicate Stats) and showcases the normalization + conversion layers

---

## Project structure (`src/`)

```
src/
├── app/
│   ├── api/
│   │   ├── auth/login/route.ts                 POST — auth
│   │   ├── banks/{chase,boa,amex}/transactions/route.ts   raw, byte-for-byte
│   │   ├── transactions/route.ts               normalized + filters + pagination
│   │   ├── transactions/[id]/route.ts          one transaction + raw source
│   │   ├── rates/route.ts                       exchange rates
│   │   ├── stats/route.ts                       Stats aggregates
│   │   ├── audit/route.ts                        Custom aggregates (oversight)
│   │   └── users/route.ts                        public users (no password)
│   ├── dashboard/
│   │   ├── layout.tsx                           auth guard + RBAC + sidebar
│   │   ├── page.tsx                             redirect → first allowed tab
│   │   ├── transactions/page.tsx
│   │   ├── stats/page.tsx
│   │   └── custom/page.tsx
│   ├── login/page.tsx
│   ├── layout.tsx                               Geist fonts + providers
│   ├── page.tsx                                 redirect → /dashboard
│   └── globals.css                              Tailwind v4 + OKLch tokens
│
├── components/
│   ├── ui/                                      shadcn primitives (vendored)
│   ├── transactions/                            TransactionsTable, TransactionFilters,
│   │                                            TransactionModal, AuthorizedByTooltip, ExportCsvButton
│   ├── stats/                                   KpiCards, SpendByCategoryChart,
│   │                                            MoneyInOutChart, TopVendorsTable
│   ├── audit/                                   AuditSummaryCards, OutliersTable, ApproverConcentration
│   ├── dashboard/app-sidebar.tsx
│   ├── date-picker.tsx · pagination.tsx · providers.tsx · theme-toggle.tsx
│
├── hooks/use-mobile.ts                          (shadcn)
│
└── lib/                                         business logic (no UI)
    ├── api/         api.client · api.response · api.schema     (generalized client + envelope)
    ├── auth/        schema · data · service · api · hooks · storage · rbac
    ├── banks/       schema · data · api · constants · normalize/{chase,boa,amex,index,resolver}
    ├── money/       schema · data · convert · format · api · hooks
    ├── transactions/ schema · service · api · hooks · display · columns · constants
    ├── stats/       schema · service · api · hooks
    ├── audit/       schema · service · api · hooks
    ├── users/       api · hooks
    ├── csv/         csv.util
    ├── date.ts
    └── utils.ts     (cn)
```

Per-domain convention in `lib/`: **schema** (zod, source of truth) · **data** (server-side read/validation) · **service** (server logic) · **api** (client call via `apiFetch`) · **hooks** (TanStack Query).

---

## AI tooling

I used an AI assistant in a limited, supporting role — not for the core application logic or architecture. Concretely, it helped with:

- Drafting and polishing this README
- Scaffolding repetitive UI boilerplate (shadcn/ui component wiring)
- Quick syntax/API lookups and the occasional TypeScript & Zod edge case
- Small, mechanical helpers (e.g. CSV escaping, formatting utilities)

All the meaningful decisions — the bank normalization strategy, RBAC, the multi-currency handling and the Audit tab logic — were designed, written and reviewed by me.
