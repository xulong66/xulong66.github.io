# Patents Section Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add four verified Chinese patent records to Long Xu's English academic homepage and publish them through the existing GitHub Pages workflow.

**Architecture:** Extend the JSON content model with a `patents` collection and render it as a semantic section in the existing single-page React view. Reuse the publication card vocabulary with patent-specific class names so the new content inherits the site's established responsive and accessible design without adding dependencies.

**Tech Stack:** React 19, TypeScript, JSON content, CSS, Vitest, Testing Library, Node test runner, Vite, GitHub Pages

**Spec:** `docs/superpowers/specs/2026-09-04-patents-section.md`

## Global Constraints

- All visible homepage copy remains in English.
- Show `Granted Chinese Invention Patent` for `B` records and `Published Chinese Patent Application` for `A` records.
- Emphasize `Long Xu` in every inventor list.
- Preserve the current theme, metadata, portrait, publication content, and social-preview asset.
- Publish to `https://xulong66.github.io/` through the existing GitHub Pages workflow.

---

### Task 1: Verified patent data and accessible section

**Files:**
- Modify: `tests/content.test.mjs`
- Modify: `tests/sections.test.tsx`
- Modify: `app/data/site-content.json`
- Modify: `app/page.tsx`
- Modify: `app/globals.css`

**Interfaces:**
- Consumes: the existing `content` JSON import, `SectionHeading`, `EmphasizedAuthors`, navigation tuple pattern, and card CSS conventions.
- Produces: `content.patents`, the `#patents` region, a `Patents` navigation target, and four accessible external patent links.

- [ ] **Step 1: Write the failing data test**

```js
test("patent content contains four verified records in reverse chronological order", async () => {
  const content = JSON.parse(await readFile(contentPath, "utf8"));
  assert.deepEqual(
    content.patents.map(({ number, year, status }) => [number, year, status]),
    [
      ["CN121368013B", 2026, "Granted Chinese Invention Patent"],
      ["CN119938160A", 2025, "Published Chinese Patent Application"],
      ["CN117880887A", 2024, "Published Chinese Patent Application"],
      ["CN116209103B", 2024, "Granted Chinese Invention Patent"],
    ],
  );
  for (const patent of content.patents) assert.ok(patent.inventors.includes("Long Xu"));
  assert.equal(content.patents[1].applicationNumber, "202411778024.X");
});
```

- [ ] **Step 2: Run the data test and verify it fails because `content.patents` is missing**

Run: `node --test tests/content.test.mjs`

Expected: FAIL in the new patent test because the collection does not exist.

- [ ] **Step 3: Write the failing UI test**

```tsx
it('links the primary navigation to a Patents section with four verified records', () => {
  render(<HomePage />);
  const navigation = screen.getByRole('navigation', { name: 'Primary navigation' });
  expect(within(navigation).getByRole('link', { name: 'Patents' })).toHaveAttribute('href', '#patents');
  const patents = screen.getByRole('region', { name: 'Patents' });
  const records = within(patents).getAllByRole('article');
  expect(records).toHaveLength(4);
  expect(within(records[0]).getByRole('heading', { name: 'Data Transmission Method, Apparatus, and System' })).toBeVisible();
  for (const record of records) {
    expect(within(record).getByText('Long Xu').tagName).toBe('STRONG');
    expect(within(record).getByRole('link', { name: /open patent/i })).toHaveAttribute('target', '_blank');
  }
});
```

- [ ] **Step 4: Run the UI test and verify it fails because the navigation link and region are missing**

Run: `npx vitest run tests/sections.test.tsx`

Expected: FAIL when querying for the missing `Patents` navigation link.

- [ ] **Step 5: Add the verified data**

Add a `patents` array in `app/data/site-content.json` containing the four records from the design specification, including `title`, `inventors`, `assignee`, `date`, `year`, `status`, `number`, optional `applicationNumber`, and `url`.

- [ ] **Step 6: Render the section and navigation target**

Add `Patents` / `#patents` to `navigation`, import Lucide's `FileBadge2`, and render patent cards after publications. Each card must use `EmphasizedAuthors`, an `aria-label` beginning with `Open patent:`, and external-link attributes. Change Education to index `05` and Contact to index `06`.

- [ ] **Step 7: Extend the established card styles**

Share layout, hover, icon, meta, title, and mobile rules between `.publication-*` and `.patent-*`, and add a `.patent-details` line for the number, date, assignee, and optional application number.

- [ ] **Step 8: Run the focused tests and verify they pass**

Run: `node --test tests/content.test.mjs && npx vitest run tests/sections.test.tsx`

Expected: both test commands exit 0 with the new data and UI behavior covered.

- [ ] **Step 9: Run the full validation suite**

Run: `npm test && npm run lint && npx tsc --noEmit && npm run build:pages`

Expected: all commands exit 0 without test, lint, type, or build failures.

- [ ] **Step 10: Commit the tested implementation**

```powershell
git add app/data/site-content.json app/page.tsx app/globals.css tests/content.test.mjs tests/sections.test.tsx docs/superpowers/specs/2026-09-04-patents-section.md docs/superpowers/plans/2026-09-04-patents-section.md
git commit -m "feat: add verified patents to homepage"
```

### Task 2: GitHub Pages publication

**Files:**
- Verify only: `.github/workflows/pages.yml`

**Interfaces:**
- Consumes: the validated `main` branch and existing Pages workflow.
- Produces: the updated public homepage at `https://xulong66.github.io/#patents`.

- [ ] **Step 1: Push the validated commit**

Run: `git -c http.version=HTTP/1.1 push origin main`

Expected: the remote `main` branch advances to the tested commit.

- [ ] **Step 2: Monitor the Pages workflow**

Read the workflow run associated with the pushed commit until its `build` and `deploy` jobs complete.

Expected: the run concludes with `success`.

- [ ] **Step 3: Verify the public artifact**

Request `https://xulong66.github.io/` and verify that the deployed HTML references the new asset bundle, then confirm that bundle contains `CN121368013B`, `CN119938160A`, `CN117880887A`, and `CN116209103B`.

Expected: all four patent numbers are present in the deployed application bundle.
