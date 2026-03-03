# Fix WhatsApp Number Display Issue Plan

## Phase 1: Analysis completed
**Agent:** `explorer-agent`, `project-planner`
- We identified that when updating Settings in the admin panel `src/app/admin/settings/page.tsx`, it calls `updateSettings` in `src/app/admin/settings/actions.ts`.
- `updateSettings` correctly updates the database and calls `revalidatePath("/")`.
- However, since `src/app/layout.tsx` also fetches `getSettings()`, `revalidatePath("/")` without the `'layout'` type might just revalidate `page.tsx` and miss the parent layout tree, leading to stale cache in Next.js Full Route Cache.
- The `getSettings()` function is used across the frontend, so any stale RSC payload causes it to fallback or use old data.

## Phase 2: Implementation Steps
**1. Cache Invalidation Fix (backend-specialist)**
- Update `src/app/admin/settings/actions.ts` to use `revalidatePath("/", "layout")` instead of just `revalidatePath("/")`. This ensures the whole cache tree for the app is cleared when settings change.
- Optionally add `unstable_noStore()` to `getSettings()` for the admin routes to prevent any aggressive caching on the settings page itself.

**2. Frontend Review (frontend-specialist)**
- Check how `whatsapp` is passed down to `ProductCard`, `FeaturedSlider`, and `TrustBar`.
- Ensure there are no other hardcoded fallbacks that could override the fetched `supportWhatsApp`.

**3. Verification Scripts (test-engineer, devops-engineer)**
- Verify if `revalidatePath` successfully takes effect.
- Run `lint_runner.py` and `security_scan.py` (if applicable) to pass Orchestration Gates.

## Deliverables
- [ ] Updated `src/app/admin/settings/actions.ts`
- [ ] Working WhatsApp config from Admin to Frontend
- [ ] All Orchestration validation scripts passed
