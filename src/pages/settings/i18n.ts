import type { DeepStringSchema } from "@/i18n/schema";

export const settingsEn = {
  settings: {
    title: "Account settings",
    usernameSection: "Change username",
    newUsername: "New username",
    usernameSuccess: "Username updated!",
    usernameError: "Could not update username. Please try again.",
    passwordSection: "Change password",
    currentPassword: "Current password",
    newPassword: "New password",
    confirmNewPassword: "Confirm new password",
    passwordMismatch: "Passwords do not match.",
    passwordTooShort: "Needs at least 8 characters",
    wrongCurrentPassword: "Current password is incorrect.",
    passwordSuccess: "Password updated!",
    passwordError: "Could not update password. Please try again.",
    saveButton: "Save",
    saving: "Saving...",
    linkedAccounts: {
      section: "Linked accounts",
      loading: "Loading...",
      link: "Link",
      unlink: "Unlink",
      unlinking: "Unlinking...",
      linkSuccess: "Account linked successfully!",
      linkError: "Failed to link account. Please try again.",
      unlinkError:
        "Could not unlink this account. Make sure you have another login method set up first.",
    },
  },
} as const;

export const settingsDe: DeepStringSchema<typeof settingsEn> = {
  settings: {
    title: "Kontoeinstellungen",
    usernameSection: "Benutzername ändern",
    newUsername: "Neuer Benutzername",
    usernameSuccess: "Benutzername aktualisiert!",
    usernameError:
      "Benutzername konnte nicht aktualisiert werden. Bitte erneut versuchen.",
    passwordSection: "Passwort ändern",
    currentPassword: "Aktuelles Passwort",
    newPassword: "Neues Passwort",
    confirmNewPassword: "Neues Passwort bestätigen",
    passwordMismatch: "Passwörter stimmen nicht überein.",
    passwordTooShort: "Mindestens 8 Zeichen erforderlich",
    wrongCurrentPassword: "Das aktuelle Passwort ist falsch.",
    passwordSuccess: "Passwort aktualisiert!",
    passwordError:
      "Passwort konnte nicht aktualisiert werden. Bitte erneut versuchen.",
    saveButton: "Speichern",
    saving: "Wird gespeichert...",
    linkedAccounts: {
      section: "Verknüpfte Konten",
      loading: "Wird geladen...",
      link: "Verknüpfen",
      unlink: "Trennen",
      unlinking: "Wird getrennt...",
      linkSuccess: "Konto erfolgreich verknüpft!",
      linkError: "Konto konnte nicht verknüpft werden. Bitte erneut versuchen.",
      unlinkError:
        "Dieses Konto konnte nicht getrennt werden. Stelle sicher, dass eine andere Anmeldemethode vorhanden ist.",
    },
  },
};
