import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { sanitizeSubdomainInput } from "./lib";

export function useHeroSectionLogic() {
  const navigate = useNavigate();
  const [subdomain, setSubdomain] = useState("");

  function handleSubdomainChange(value: string) {
    setSubdomain(sanitizeSubdomainInput(value));
  }

  function handleCheckAvailability() {
    void navigate({ to: "/register" });
  }

  return { subdomain, handleSubdomainChange, handleCheckAvailability };
}
