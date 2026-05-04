interface ConfirmModalProps {
  readonly isOpen: boolean;
  readonly title: string;
  readonly description: string;
  readonly confirmLabel: string;
  readonly cancelLabel: string;
  readonly isLoading?: boolean;
  readonly onConfirm: () => void;
  readonly onCancel: () => void;
}

export function ConfirmModal({
  isOpen,
  title,
  description,
  confirmLabel,
  cancelLabel,
  isLoading,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/60"
        onClick={onCancel}
        aria-hidden
      />
      <div className="relative z-10 bg-secondary-background border-[3px] border-foreground shadow-pixel rounded-radius p-6 max-w-[400px] w-full mx-5 flex flex-col gap-4">
        <h3 className="text-[20px]">{title}</h3>
        <p className="text-base opacity-70">{description}</p>
        <div className="flex gap-3 justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="pbtn ghost sm"
            disabled={isLoading}
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="pbtn sm"
            style={{ background: "var(--destructive)", color: "white" }}
            disabled={isLoading}
          >
            {isLoading ? "..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
