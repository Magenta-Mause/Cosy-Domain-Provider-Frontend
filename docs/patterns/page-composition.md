# Page Composition

## Target depth

A page's `return` statement should be no deeper than **3 levels of nesting**. The goal is for pages to read as a collection of named components, not as layout code.

```tsx
// Good — page describes structure, components own their internals
export function DashboardPage() {
  const { subdomains, isVerified, handleCreateNew } = useDashboardLogic();
  return (
    <div style={{ minHeight: "100vh", background: "var(--background)" }}>
      <DashboardBanner isVerified={isVerified} onCreateNew={handleCreateNew} />
      <div className="flex flex-col p-[20px] max-w-[1200px] mx-auto gap-5">
        <UserPricingCard serverCount={subdomains.length} />
        <SubdomainList subdomains={subdomains} ... />
      </div>
    </div>
  );
}

// Bad — page doubles as layout component
export function DashboardPage() {
  return (
    <div style={{ minHeight: "100vh" }}>
      <div className="sky-bg">
        <AppHeader />
        <div style={{ padding: "20px 28px", maxWidth: 1200 }}>
          <div style={{ display: "flex", alignItems: "flex-end" }}>
            <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
              <div className="pixel" style={{ fontSize: 11 }}>...</div>
              <h1>...</h1>
            </div>
            <Button>...</Button>
          </div>
        </div>
      </div>
      ...
    </div>
  );
}
```

## Pattern

When a page has a visually distinct banner/header area (sky background, mailbox, page title), extract it as a dedicated component in the page's `components/` folder:

```
pages/dashboard/components/dashboard-banner.tsx     ← sky-bg + AppHeader + title row
pages/domain-detail/components/domain-detail-header.tsx  ← sky-bg + AppHeader + back link + domain title
```

These banner components receive only the props they need to render — they do not call hooks themselves (except `useTranslation`).

## Auth pages

Pages that use `<AuthPageLayout>` already satisfy the depth requirement. The layout component is the top level; the page renders one or two direct children:

```tsx
// verify/index.tsx — 2 levels
return (
  <AuthPageLayout backButtonLink="/dashboard">
    <VerifyForm ... />
  </AuthPageLayout>
);
```

Extract view variants (e.g. verified vs. unverified state) into separate components rather than nesting conditional markup inline.

## Loading states

A full-page loading state is acceptable as an early return with slightly more structure:

```tsx
if (isInitialLoading) {
  return (
    <div style={{ minHeight: "100vh", background: "var(--background)" }}>
      <div className="sky-bg"><AppHeader /></div>
      <div style={{ padding: 40, textAlign: "center" }}><DotLoader /></div>
    </div>
  );
}
```

This is a temporary render path and does not need to match the same composition quality as the main return.
