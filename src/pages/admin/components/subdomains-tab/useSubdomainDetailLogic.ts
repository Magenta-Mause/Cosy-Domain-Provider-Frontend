import { useNavigate } from "@tanstack/react-router";

export function useSubdomainDetailLogic() {
  const navigate = useNavigate();

  const handleBack = () => void navigate({ to: "/admin/subdomains" });

  return { handleBack };
}
