import { Badge } from "@/components/pixel/badge.tsx";
import { FlatPanel } from "@/components/pixel/panel.tsx";

export type PricingModel = "FREE" | "COSY+";

interface UserPricingCardProps {
  pricingModel: PricingModel;
  serverCount: number;
}

export const PRICING_GAME_SERVER_COUNT: Record<PricingModel, number> = {
  "COSY+": 5,
  FREE: 1,
};

const UserPricingCard = (props: UserPricingCardProps) => {
  return (
    <FlatPanel className={"px-5 py-4 flex flex-col gap-2"}>
      <Badge
        color={props.pricingModel === "COSY+" ? "accent" : "gray"}
        className={"py-1 w-fit"}
      >
        {props.pricingModel === "COSY+" ? "Cosy +" : "Free"}
      </Badge>
      <div>
        {props.serverCount}/{PRICING_GAME_SERVER_COUNT[props.pricingModel]}{" "}
        Subdomains
      </div>
    </FlatPanel>
  );
};

export default UserPricingCard;
