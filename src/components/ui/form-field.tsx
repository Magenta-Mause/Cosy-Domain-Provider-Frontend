import type React from "react";

import { ErrorMessage } from "@/components/pixel/error-message";

interface FormFieldProps {
  readonly id: string;
  readonly label: string;
  readonly type?: string;
  readonly value: string;
  readonly onChange: (value: string) => void;
  readonly placeholder?: string;
  readonly error?: string | null;
  readonly required?: boolean;
  readonly disabled?: boolean;
  readonly readOnly?: boolean;
  readonly invalid?: boolean;
  /** Text suffix shown inside the right edge of the input (e.g. ".play.cosy-hosting.net"). */
  readonly suffix?: string;
  /** Arbitrary right-side slot, e.g. a password visibility toggle button. */
  readonly endDecorator?: React.ReactNode;
  readonly testId?: string;
  readonly hint?: string;
  readonly autoComplete?: string;
  readonly minLength?: number;
  readonly maxLength?: number;
  readonly inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
}

export function FormField({
  id,
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  error,
  required,
  disabled,
  readOnly,
  invalid,
  suffix,
  endDecorator,
  testId,
  hint,
  autoComplete,
  minLength,
  maxLength,
  inputMode,
}: FormFieldProps) {
  const isInvalid = invalid || !!error;
  const suffixPadding = suffix ? suffix.length * 9 + 28 : undefined;

  return (
    <div className="flex flex-col gap-2">
      <label className="plabel" htmlFor={id}>
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          data-testid={testId}
          className={`pinput${isInvalid ? " invalid" : ""}${readOnly || disabled ? " opacity-50 select-none" : ""}${endDecorator ? " pr-12" : ""}`}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          readOnly={readOnly}
          autoComplete={autoComplete}
          minLength={minLength}
          maxLength={maxLength}
          inputMode={inputMode}
          style={suffixPadding ? { paddingRight: suffixPadding } : undefined}
        />
        {suffix && (
          <span className="absolute right-[14px] top-1/2 -translate-y-1/2 text-lg opacity-70 pointer-events-none">
            {suffix}
          </span>
        )}
        {endDecorator && (
          <div className="absolute right-[10px] top-1/2 -translate-y-1/2 flex items-center">
            {endDecorator}
          </div>
        )}
      </div>
      {hint && !error && <div className="text-base opacity-[0.65]">{hint}</div>}
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </div>
  );
}
