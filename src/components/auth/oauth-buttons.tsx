import {
  DiscordIcon,
  GitHubIcon,
  GoogleIcon,
} from "@/components/ui/brand-icons";
import { Button } from "@/components/ui/button";
import useDataInteractions from "@/hooks/useDataInteractions/useDataInteractions";

type OAuthVariant = "login" | "register";

export function OAuthButtons({ variant }: { variant: OAuthVariant }) {
  const { initiateOAuth } = useDataInteractions();

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        type="button"
        variant="secondary"
        className="flex-1"
        data-testid={`${variant}-oauth-google-btn`}
        aria-label="Google"
        onClick={() => initiateOAuth("google")}
      >
        <GoogleIcon />
      </Button>
      <Button
        type="button"
        variant="secondary"
        className="flex-1"
        data-testid={`${variant}-oauth-github-btn`}
        aria-label="GitHub"
        onClick={() => initiateOAuth("github")}
      >
        <GitHubIcon />
      </Button>
      <Button
        type="button"
        variant="secondary"
        className="flex-1"
        data-testid={`${variant}-oauth-discord-btn`}
        aria-label="Discord"
        onClick={() => initiateOAuth("discord")}
      >
        <DiscordIcon />
      </Button>
    </div>
  );
}
