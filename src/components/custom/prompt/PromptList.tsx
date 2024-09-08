import { ComponentProps } from "react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui";
import { ScrollArea } from "@/components/ui";
import { Prompt } from "@/hooks/prompts-data"
import { usePrompt } from "@/hooks/use-prompts";

interface PromptListProps {
  items: Prompt[];
}

export function PromptList({ items }: PromptListProps) {
  const [prompt, setPrompt] = usePrompt();

  return (
    <ScrollArea className="h-full overflow-auto">
      <div className="flex flex-col = gap-2 p-4 pt-0">
        {items.map((item) => (
          <button
            key={item.id}
            className={cn(
              "flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent",
              prompt.selected === item.id && "bg-muted"
            )}
            onClick={() =>
              setPrompt({
                ...prompt,
                selected: item.id,
              })
            }
          >
            <div className="flex w-full flex-col gap-1">
              <div className="flex items-center">
                <div className="flex items-center gap-2">
                <div className="font-semibold">{item.name}</div>

                  {item.favoriate && (
                    <span className="flex h-2 w-2 rounded-full bg-blue-600" />
                  )}
                </div>
              </div>
            </div>
            <div className="line-clamp-2 text-xs text-muted-foreground">
              {item.text.substring(0, 300)}
            </div>
            {item.labels.length ? (
              <div className="flex items-center gap-2">
                {item.labels.map((label) => (
                  <Badge key={label} variant={getBadgeVariantFromLabel(label)}>
                    {label}
                  </Badge>
                ))}
              </div>
            ) : null}
          </button>
        ))}
      </div>
    </ScrollArea>
  );
}

function getBadgeVariantFromLabel(
  label: string
): ComponentProps<typeof Badge>["variant"] {
  if (["work"].includes(label.toLowerCase())) {
    return "outline";
  }

  if (["personal"].includes(label.toLowerCase())) {
    return "outline";
  }

  return "outline";
}
