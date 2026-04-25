import mailBoxImageSmall from "@/assets/castle.png";

interface MailboxProps {
  size?: number;
}

export function Mailbox({ size = 58 }: MailboxProps) {
  return (
    <img
      src={mailBoxImageSmall}
      alt={"Cosy Mailbox"}
      className="w-auto m-auto"
      style={{ height: `${size}px` }}
    />
  );
}
