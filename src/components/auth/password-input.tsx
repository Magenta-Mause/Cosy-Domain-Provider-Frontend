import { useState } from "react";
import eyeClosedIcon from "@/assets/eye-closed.webp";
import eyeOpenIcon from "@/assets/eye-open.webp";
import { Icon } from "@/components/ui/icon";

interface PasswordInputProps {
  readonly id: string;
  readonly autoComplete?: string;
  readonly required?: boolean;
  readonly minLength?: number;
  readonly placeholder?: string;
  readonly value: string;
  readonly onChange: (value: string) => void;
  readonly style?: React.CSSProperties;
  readonly testId?: string;
  readonly toggleTestId?: string;
}

export function PasswordInput({
  id,
  autoComplete = "current-password",
  required,
  minLength,
  placeholder = "",
  value,
  onChange,
  style,
  testId,
  toggleTestId,
}: PasswordInputProps) {
  const [showPw, setShowPw] = useState(false);

  return (
    <div className="relative">
      <input
        id={id}
        data-testid={testId}
        className={["pinput pr-20", !showPw && "tracking-widest"]
          .filter(Boolean)
          .join(" ")}
        type={showPw ? "text" : "password"}
        autoComplete={autoComplete}
        required={required}
        minLength={minLength}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={style}
      />
      <button
        type="button"
        data-testid={toggleTestId}
        aria-label={showPw ? "Hide password" : "Show password"}
        onClick={() => setShowPw((v) => !v)}
        className="absolute right-[10px] top-1/2 -translate-y-1/2 opacity-70 hover:opacity-100 flex items-center"
      >
        <Icon src={showPw ? eyeOpenIcon : eyeClosedIcon} className="size-6" />
      </button>
    </div>
  );
}
