import { Car } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { EmptyState } from "@/components/garage/bits";

export default function GarageNotFound() {
  return (
    <EmptyState
      icon={Car}
      title="We couldn't find that"
      body="It may have moved, or it isn't on your account. Everything you own is in your collection."
      action={<ButtonLink href="/garage" size="sm">Back to collection</ButtonLink>}
      className="mx-auto mt-10 max-w-lg"
    />
  );
}
