import { Badge } from "@/components/ui";

import { usePrompt } from "@/hooks/use-prompts";

export function PromptMeta() {
  const { query, selected, actived } = usePrompt();
  const { data } = query;
  const prompts = data;
  const prompt =
    prompts?.find((p) => p.id === selected) || prompts ? prompts[0] : undefined;
  const labels = prompt?.labels ? prompt.labels.split(",") : [];

  return (
    <div className="flex flex-row justify-between items-start p-1 h-[50px]">
      <div className="flex flex-row w-[460px] flex-wrap justify-between">
        <div className="flex flex-col items-start gap-1 pl-2">
          <h1 className="text-md font-bold"> {prompt?.title} </h1>
          <p className="text-[13px] text-slate-500">{prompt?.desc}</p>
        </div>
        <div className="flex items-center gap-2">
          {labels.length ? (
            <div className="flex items-center gap-2">
              {actived === prompt?.id ? (
                <Badge variant={"default"}>{"active"}</Badge>
              ) : (
                <Badge variant={"outline"}>{"unused"}</Badge>
              )}

              {labels.map((label) => (
                <Badge key={label} variant={"outline"}>
                  {label}
                </Badge>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
