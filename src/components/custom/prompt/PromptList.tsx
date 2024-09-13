import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui";
import { Prompt } from "@/rust-bindings";
import { usePrompt } from "@/hooks/use-prompts";

interface PromptListProps {
  items: Prompt[];
}

export function PromptList({ items }: PromptListProps) {
  const prompts = usePrompt();

  return (
    <ScrollArea className="h-full overflow-auto">
      <div className="flex flex-col = gap-2 p-4 pt-0">
        {items.map((item) => (
          <button
            key={item.id}
            className={cn(
              "flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent",
              prompts.selected === item.id && "bg-muted"
            )}
            onClick={() => prompts.setSelected(item.id)}
          >
            <div className="flex w-full flex-col gap-1">
              <div className="flex items-center">
                <div className="flex items-center gap-2">
                  <div className="font-semibold">{item.title}</div>

                  {item.favorite && (
                    <span className="flex h-2 w-2 rounded-full bg-blue-600" />
                  )}
                </div>
              </div>
            </div>
            <div className="line-clamp-2 text-xs text-muted-foreground">
              {item.system.substring(0, 300)}
            </div>
            {/* {item.labels.length ? (
              <div className="flex items-center gap-2">
                {item.labels.map((label) => (
                  <Badge key={label} variant={getBadgeVariantFromLabel(label)}>
                    {label}
                  </Badge>
                ))}
              </div>
            ) : null} */}
          </button>
        ))}
      </div>
    </ScrollArea>
  );
}
