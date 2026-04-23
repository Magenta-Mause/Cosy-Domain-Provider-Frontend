import eyeClosedIcon from "@/assets/eyeClosed.webp";
import eyeOpenIcon from "@/assets/eyeOpen.webp";
import { Icon } from "@/components/ui/icon";

interface PasswordInputProps {
  id: string;
  autoComplete?: string;
  required?: boolean;
  minLength?: number;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  showPw: boolean;
  onToggleShow: () => void;
  style?: React.CSSProperties;
  testId?: string;
  toggleTestId?: string;
}

export function PasswordInput({
  id,
  autoComplete = "current-password",
  required,
  minLength,
  placeholder = "••••••••",
  value,
  onChange,
  showPw,
  onToggleShow,
  style,
  testId,
  toggleTestId,
}: PasswordInputProps) {
  return (
    <div className="relative">
      <input
        id={id}
        data-testid={testId}
        className="pinput pr-20"
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
        onClick={onToggleShow}
        className="absolute right-[10px] top-1/2 -translate-y-1/2 opacity-70 hover:opacity-100 flex items-center"
      >
        <Icon src={showPw ? eyeOpenIcon : eyeClosedIcon} className="size-6" />
      </button>
    </div>
  );
}
