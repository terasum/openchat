import { Input, Separator } from "@/components/ui";
import { useAppSelector, useAppDispatch } from "@/hooks/use-state";
import { updateSelectPrompt } from "@/store/prompts";

export function PromptMeta() {
  const selectedPrompt = useAppSelector(
    (state) => state.prompts.selectedPrompt
  );
  const activatedPrompt = useAppSelector(
    (state) => state.prompts.activatedPrompt
  );
  const dispatch = useAppDispatch();

  const onTitleChange = (title: string) => {
    dispatch(
      updateSelectPrompt({
        ...selectedPrompt,
        title: title,
      })
    );
  };
  const onDescChange = (title: string) => {
    dispatch(
      updateSelectPrompt({
        ...selectedPrompt,
        desc: title,
      })
    );
  };


  return (
    <>
      <div className="flex flex-row justify-between items-start p-2 h-[100px]">
        <div className="flex flex-col w-[500px] flex-wrap justify-between">
          <div className="flex flex-row items-center gap-1 pl-2">
            <span className="ext-md text-slate-500 pr-4">名称:</span>
            <Input
              className="text-md w-[280px] outline-none shadow-none"
              defaultValue={selectedPrompt.title || ""}
              onChange={(e) => {
                onTitleChange(e.target.value);
              }}
            />
            <span className="ext-md text-slate-500 pl-4">
              ID: {selectedPrompt.id}
            </span>
          </div>

          <div className="flex flex-row items-center gap-1 pl-2 pt-1">
            <span className="ext-md text-slate-500 pr-4">简介:</span>
            <Input
              className="ext-md w-[280px] outline-none shadow-none"
              defaultValue={selectedPrompt.desc || ""}
              onChange={(e) => {
                onDescChange(e.target.value);
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
