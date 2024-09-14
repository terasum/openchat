import { cn } from "@/lib/utils";
import { PromptStateProps } from "@/hooks/use-prompts";

export function PromptList({ props }: { props: PromptStateProps }) {
  const { prompts, selectedPrompt, setSelected } = props;

  return (
    <div className="h-full overflow-y-auto mt-0">
      <div className="flex flex-col = gap-2 p-4 pt-0 overflow-y-auto">
        {prompts.map((item) => (
          <button
            key={item.id}
            className={cn(
              "flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent",
              selectedPrompt.id === item.id && "bg-muted"
            )}
            onClick={() => setSelected(item.id)}
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
              {item.desc.substring(0, 30)}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
