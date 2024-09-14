import { Input, Separator } from "@/components/ui";
import { PromptStateProps } from "@/hooks/use-prompts";

export function PromptMeta({ props }: { props: PromptStateProps }) {
  const { selectedPrompt, activatedPrompt, updatePrompt } = props;

  return (
    <>
      <div className="flex flex-row justify-between items-start p-2 h-[100px]">
        <div className="flex flex-col w-[500px] flex-wrap justify-between">
          <div className="flex flex-row items-center gap-1 pl-2">
            <span className="ext-md text-slate-500 pr-4">名称:</span>
            <Input
              className="text-md w-[280px] outline-none shadow-none"
              value={selectedPrompt.title}
              onChange={(e) => {
                console.log(e.target.value);
                updatePrompt({
                  ...selectedPrompt,
                  title: e.target.value,
                });
              }}
            />
            <span className="ext-md text-slate-500 pl-4">ID: {selectedPrompt.id}</span>
          </div>

          <div className="flex flex-row items-center gap-1 pl-2 pt-1">
            <span className="ext-md text-slate-500 pr-4">简介:</span>
            <Input
              className="ext-md w-[280px] outline-none shadow-none"
              value={selectedPrompt.desc}
              onChange={(e) => {
                updatePrompt({
                  ...selectedPrompt,
                  desc: e.target.value,
                });
              }}
            />
            <span className="ext-md text-slate-500 pl-4">
              Active: {activatedPrompt.id}
            </span>
          </div>
        </div>
      </div>
      <Separator />
    </>
  );
}
