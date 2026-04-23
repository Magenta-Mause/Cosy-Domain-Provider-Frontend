interface PasswordStrengthProps {
  password: string;
}

export function PasswordStrength({ password }: PasswordStrengthProps) {
  if (password.length === 0) return null;

  const isWeak = password.length < 8;
  const isStrong = password.length >= 12;

  const strengthColor = isStrong
    ? "var(--accent-2)"
    : isWeak
      ? "var(--destructive)"
      : "var(--accent)";

  return (
    <div className="flex gap-1">
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          className="flex-1 h-2 border-2 border-foreground"
          style={{
            background:
              password.length > i * 3 ? strengthColor : "var(--input-bg)",
          }}
        />
      ))}
    </div>
  );
}
