import { ErrorMessage } from "@/components/pixel/error-message";

interface InputFieldProps {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string | null;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  invalid?: boolean;
  endDecorator?: string;
  testId?: string;
  hint?: string;
  autoComplete?: string;
  minLength?: number;
  maxLength?: number;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
}

export function InputField({
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
  endDecorator,
  testId,
  hint,
  autoComplete,
  minLength,
  maxLength,
  inputMode,
}: InputFieldProps) {
  const isInvalid = invalid || !!error;
  const decoratorPadding = endDecorator
    ? endDecorator.length * 9 + 28
    : undefined;

  return (
    <div className="flex flex-col gap-2">
      <label className="plabel" htmlFor={id}>
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          data-testid={testId}
          className={`pinput${isInvalid ? " invalid" : ""}${readOnly || disabled ? " opacity-50 select-none" : ""}`}
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
          style={
            decoratorPadding ? { paddingRight: decoratorPadding } : undefined
          }
        />
        {endDecorator && (
          <span className="absolute right-[14px] top-1/2 -translate-y-1/2 text-lg opacity-70 pointer-events-none">
            {endDecorator}
          </span>
        )}
      </div>
      {hint && !error && <div className="text-base opacity-[0.65]">{hint}</div>}
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </div>
  );
}
