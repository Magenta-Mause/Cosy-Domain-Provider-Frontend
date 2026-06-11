import { useState } from "react";

import eyeClosedIcon from "@/assets/eye-closed.webp";
import eyeOpenIcon from "@/assets/eye-open.webp";
import { FormField } from "./form-field";
import { Icon } from "./icon";

interface PasswordFieldProps {
  readonly id: string;
  readonly label: string;
  readonly value: string;
  readonly onChange: (value: string) => void;
  readonly autoComplete?: string;
  readonly required?: boolean;
  readonly disabled?: boolean;
  readonly minLength?: number;
  readonly placeholder?: string;
  readonly error?: string | null;
  readonly hint?: string;
  readonly testId?: string;
  readonly toggleTestId?: string;
}

/**
 * Labeled password input with a visibility eye-toggle. Each instance owns its
 * own show/hide state — never share one toggle across multiple fields.
 */
export function PasswordField({
  id,
  label,
  value,
  onChange,
  autoComplete = "current-password",
  required,
  disabled,
  minLength,
  placeholder,
  error,
  hint,
  testId,
  toggleTestId,
}: PasswordFieldProps) {
  const [showPw, setShowPw] = useState(false);

  return (
    <FormField
      id={id}
      label={label}
      type={showPw ? "text" : "password"}
      value={value}
      onChange={onChange}
      autoComplete={autoComplete}
      required={required}
      disabled={disabled}
      minLength={minLength}
      placeholder={placeholder}
      error={error}
      hint={hint}
      testId={testId}
      endDecorator={
        <button
          type="button"
          data-testid={toggleTestId}
          aria-label={showPw ? "Hide password" : "Show password"}
          onClick={() => setShowPw((v) => !v)}
          className="opacity-70 hover:opacity-100 flex items-center"
        >
          <Icon src={showPw ? eyeOpenIcon : eyeClosedIcon} className="size-6" />
        </button>
      }
    />
  );
}
