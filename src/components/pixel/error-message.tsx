export function ErrorMessage({ children }: { children: React.ReactNode }) {
  return <div className="text-base text-destructive">⚠ {children}</div>;
}
