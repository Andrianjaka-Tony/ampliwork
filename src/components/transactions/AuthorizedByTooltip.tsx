import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type { TransactionAuthorizer } from "@/lib/transactions/transactions.schema";

function initials(name: string): string {
  return name
    .split(/\s+/)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function AuthorizedByTooltip({ authorizer }: { authorizer: TransactionAuthorizer | null }) {
  if (!authorizer) return <span className="text-muted-foreground">—</span>;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="cursor-default underline decoration-dotted underline-offset-4">
          {authorizer.name}
        </span>
      </TooltipTrigger>
      <TooltipContent className="flex items-center gap-3 p-3">
        <Avatar className="size-9">
          <AvatarFallback className="bg-primary-foreground text-primary text-xs font-medium">
            {initials(authorizer.name)}
          </AvatarFallback>
        </Avatar>
        <div className="text-left">
          <div className="font-medium">{authorizer.name}</div>
          <div className="text-xs opacity-80">{authorizer.email}</div>
          <div className="text-xs capitalize opacity-80">{authorizer.role.replace("_", " ")}</div>
        </div>
      </TooltipContent>
    </Tooltip>
  );
}
