import { usePrompt } from "@/hooks/use-prompts";
export function PromptMeta() {
  const { query, selected } = usePrompt();
  const { data } = query;
  const prompts = data;
  const prompt =
    prompts?.find((p) => p.id === selected) || prompts ? prompts[0] : undefined;

  return (
    <div className="flex flex-row justify-between items-start p-1 h-[50px]">
      <div className="flex flex-row w-[460px] flex-wrap justify-between">
        <div className="flex flex-col items-start gap-1 pl-2">
          <h1 className="text-md font-bold"> {prompt?.title} </h1>
          <p className="text-[13px] text-slate-500">{prompt?.desc}</p>
        </div>
      </div>
    </div>
  );
}
