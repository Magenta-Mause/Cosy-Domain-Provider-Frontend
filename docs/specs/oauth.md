# OAuth Feature Spec — Google, GitHub, Discord

## Overview

Add social login to the existing credential-based auth system. Users can authenticate via Google, GitHub, or Discord using the Authorization Code Flow, handled entirely server-side. The frontend redirects to the backend to start the flow; the backend handles the OAuth dance, then redirects back with a session cookie set — identical to the result of a normal login.

---

## Backend

### New dependency

Add Spring Security OAuth2 Client (`spring-boot-starter-oauth2-client`) to `pom.xml`.

### Configuration

`application.properties` (values come from env vars):

```properties
spring.security.oauth2.client.registration.google.client-id=${OAUTH_GOOGLE_CLIENT_ID}
spring.security.oauth2.client.registration.google.client-secret=${OAUTH_GOOGLE_CLIENT_SECRET}
spring.security.oauth2.client.registration.google.scope=openid,email,profile
spring.security.oauth2.client.registration.google.redirect-uri={baseUrl}/api/v1/auth/oauth/google/callback

spring.security.oauth2.client.registration.github.client-id=${OAUTH_GITHUB_CLIENT_ID}
spring.security.oauth2.client.registration.github.client-secret=${OAUTH_GITHUB_CLIENT_SECRET}
spring.security.oauth2.client.registration.github.scope=read:user,user:email
spring.security.oauth2.client.registration.github.redirect-uri={baseUrl}/api/v1/auth/oauth/github/callback

spring.security.oauth2.client.registration.discord.client-id=${OAUTH_DISCORD_CLIENT_ID}
spring.security.oauth2.client.registration.discord.client-secret=${OAUTH_DISCORD_CLIENT_SECRET}
spring.security.oauth2.client.registration.discord.scope=identify,email
spring.security.oauth2.client.registration.discord.redirect-uri={baseUrl}/api/v1/auth/oauth/discord/callback
spring.security.oauth2.client.provider.discord.authorization-uri=https://discord.com/api/oauth2/authorize
spring.security.oauth2.client.provider.discord.token-uri=https://discord.com/api/oauth2/token
spring.security.oauth2.client.provider.discord.user-info-uri=https://discord.com/api/users/@me
spring.security.oauth2.client.provider.discord.user-name-attribute=username
```

### Database changes

#### New entity: `OAuthIdentityEntity`

```java
@Entity
public class OAuthIdentityEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String uuid;

    @ManyToOne(optional = false)
    private UserEntity user;

    @Column(nullable = false)
    private String provider;          // "google" | "github" | "discord"

    @Column(nullable = false)
    private String providerSubject;   // provider's stable user ID

    @Column(nullable = false)
    private String email;
}
```

Unique constraint on `(provider, providerSubject)`.

#### Changed: `UserEntity`

Make `passwordHash` nullable — OAuth-only accounts have no password:

```java
// before
@Column(nullable = false)
private String passwordHash;

// after
private String passwordHash;  // nullable — null for OAuth-only accounts
```

Add flag for password-setup prompt:

```java
@Column(nullable = false)
private boolean needsPasswordSetup = false;
```

This is `true` for accounts created via OAuth that have not yet set a password.

### New endpoints

All under `/api/v1/auth/oauth/**` — already covered by the existing `permitAll` matcher.

#### `GET /api/v1/auth/oauth/{provider}/authorize`

Builds the provider's authorization URL (using `OAuth2AuthorizedClientManager` or manual URL construction with a generated `state` token stored in the HTTP session), then returns a redirect to it.

#### `GET /api/v1/auth/oauth/{provider}/callback`

1. Validate the `state` parameter against the session.
2. Exchange the `code` for an access token via the provider's token endpoint.
3. Fetch the user's profile (email + provider subject ID) from the provider's userinfo endpoint.
4. **Account resolution:**
   - Look up `OAuthIdentityEntity` by `(provider, providerSubject)`.
   - If found → use the linked `UserEntity`.
   - If not found → look up `UserEntity` by email.
     - If found → create `OAuthIdentityEntity` linking them (silent account linking).
     - If not found → create a new `UserEntity` (username derived from provider profile name, `passwordHash = null`, `needsPasswordSetup = true`) and a new `OAuthIdentityEntity`.
5. Generate a refresh token via `AuthorizationService.generateRefreshToken(user.getUuid())`.
6. Set the `refreshToken` cookie (same `ResponseCookie` construction as `AuthorizationController.buildRefreshTokenResponse`).
7. Redirect to `http://localhost:5173/dashboard` (configurable via `app.frontend-url` property).

On any error: redirect to `http://localhost:5173/login?oauthError=true`.

### New endpoint: `POST /api/v1/auth/set-password`

For OAuth users completing password setup. Requires a valid identity token (authenticated).

Request body: `{ "password": "..." }`

- Validates the password is not blank and meets minimum length.
- Hashes and saves it on the `UserEntity`.
- Sets `needsPasswordSetup = false`.

### Updated: `UserDto`

Add `needsPasswordSetup: boolean` so the frontend knows to show the setup prompt.

### Updated: `AuthorizationService.loginUser`

Guard against OAuth-only accounts attempting password login:

```java
if (user.getPasswordHash() == null) {
    throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "This account uses social login");
}
```

### Security config changes

- Permit `GET /api/v1/auth/oauth/**` — already covered by `/api/v1/auth/**`.
- No Spring OAuth2 login filter needed (manual controller flow).

---

## Frontend

### New API calls (in `useDataInteractions`)

```ts
// Redirects the browser to start the OAuth flow — not an axios call
initiateOAuth(provider: "google" | "github" | "discord") {
  window.location.href = `/api/v1/auth/oauth/${provider}/authorize`;
}

// Calls POST /api/v1/auth/set-password
setPassword(password: string): Promise<void>
```

### Auth store changes (`auth-slice.ts`)

Add `needsPasswordSetup: boolean` to `AuthUser`:

```ts
export interface AuthUser {
  // ...existing fields
  needsPasswordSetup: boolean;
}
```

Parse from the JWT claims or from `UserDto` returned by a `/api/v1/user/me` call after login.

### Error handling for OAuth callback errors

The backend redirects to `/login?oauthError=true` on failure.

In `LoginForm`, read the query param on mount:

```ts
const { oauthError } = Route.useSearch();
// if oauthError is truthy, show <ErrorMessage> with t("login.oauthError")
```

Add `oauthError` to the `/login` route's search param schema.

### Login page (`login-form.tsx`)

Below the existing form, add:

```
──── Or continue with ────

[Google]  [GitHub]  [Discord]
```

Each button calls `initiateOAuth(provider)`. Buttons use the existing `pbtn` style variant. Include provider SVG logos (inline or imported from `lucide-react` / a small SVG file).

### Register page (`register-form.tsx`)

Same provider buttons, same behavior — the backend auto-creates the account on first OAuth login. Show them below the register form with the divider "Or sign up with".

### Password setup modal

After `bootstrapAuth` resolves, if `user.needsPasswordSetup === true`, show a modal/dialog (not a separate route) prompting the user to set a password.

- Single password field + confirm field with the existing `PasswordInput` component and `PasswordStrength` indicator.
- Submits via `setPassword(password)`.
- On success: update `needsPasswordSetup = false` in the Redux store and close the modal.
- Has a "Skip for now" option — dismisses the modal without clearing the flag (will reappear next login).

The modal renders inside `AuthProvider` or at the root layout level, gated on `user?.needsPasswordSetup`.

### New i18n keys

Add to both `en` and `de` in `src/i18n/resources.ts`:

```ts
// login
"login.oauthDivider": "Or continue with",
"login.oauthGoogle": "Continue with Google",
"login.oauthGithub": "Continue with GitHub",
"login.oauthDiscord": "Continue with Discord",
"login.oauthError": "Sign-in failed. Please try again.",

// register
"register.oauthDivider": "Or sign up with",
"register.oauthGoogle": "Sign up with Google",
"register.oauthGithub": "Sign up with GitHub",
"register.oauthDiscord": "Sign up with Discord",

// password setup modal
"passwordSetup.title": "Set a password",
"passwordSetup.description": "Add a password so you can also sign in with email.",
"passwordSetup.password": "Password",
"passwordSetup.confirm": "Confirm password",
"passwordSetup.submit": "Save password",
"passwordSetup.skip": "Skip for now",
"passwordSetup.mismatch": "Passwords do not match",
"passwordSetup.success": "Password saved",
```

---

## Implementation order

1. Backend: DB migration + `OAuthIdentityEntity` + make `passwordHash` nullable
2. Backend: `OAuthController` — `/authorize` + `/callback` for all three providers
3. Backend: `UserDto.needsPasswordSetup` + `POST /api/v1/auth/set-password`
4. Frontend: `bun gen:api` to pick up updated OpenAPI spec
5. Frontend: OAuth buttons on login + register pages
6. Frontend: `oauthError` query param handling on login route
7. Frontend: password setup modal
