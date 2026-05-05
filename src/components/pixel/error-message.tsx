export function ErrorMessage({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  return <div className="text-base text-destructive">⚠ {children}</div>;
}
