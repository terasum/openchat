import {
  Separator,
  Textarea,
  Button,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui";
import { CheckCheck } from "lucide-react";

import { PromptMeta } from "./PromptMeta";
import { PromptSettings } from "./PromptSettings";
import { PromptToolbar } from "./PromptToolbar";

import { useAppDispatch, useAppSelector } from "@/hooks/use-state";
import {
  asyncPromptUpdate,
  updateSelectPrompt,
  asyncPromptActiveSet,
} from "@/store/prompts";
import { message } from "@tauri-apps/api/dialog";
export function PromptContent() {
  const selectedPrompt = useAppSelector(
    (state) => state.prompts.selectedPrompt
  );

  const dispatch = useAppDispatch();

  const onContentChange = (content: string) => {
    dispatch(
      updateSelectPrompt({
        ...selectedPrompt,
        system: content,
      })
    );
  };
  const onClickSave = async () => {
    await dispatch(asyncPromptUpdate({ ...selectedPrompt }));
    dispatch(asyncPromptActiveSet(selectedPrompt.id));
    await message("保存并激活成功", { type: "info" });
  };

  return (
    <>
      <PromptToolbar />
      <Separator />
      <PromptMeta />
      <div className="flex flex-col h-[calc(100%-160px)] overflow-y-auto">
        <div className="flex flex-row flex-1 h-[calc(100%-40px)]">
          <Tabs defaultValue="system-prompt" className="h-full w-full">
            <div className="flex items-center px-4 py-2 select-none cursor-default">
              <TabsList className="">
                <TabsTrigger
                  value="system-prompt"
                  className="text-zinc-600 dark:text-zinc-200"
                >
                  系统提示词
                </TabsTrigger>
                <TabsTrigger
                  value="prompt-settings"
                  className="text-zinc-600 dark:text-zinc-200"
                >
                  提示词设置
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent
              value="system-prompt"
              className="h-[calc(100%-60px)] w-full p-2"
            >
              <Textarea
                defaultValue={selectedPrompt.system || ""}
                className="w-[100%] h-[calc(100%-20px)] text-sm overflow-y-auto"
                onChange={(e) => {
                  onContentChange(e.target.value);
                }}
                onContextMenu={(e)=>{
                  e.stopPropagation();
                }}
              />
            </TabsContent>

            <TabsContent
              value="prompt-settings"
              className="h-[calc(100%-60px)] w-full p-2"
            >
              <PromptSettings />
            </TabsContent>
          </Tabs>
        </div>
        <div className="flex flex-row items-center justify-end h-[40px]">
          <Button className="mr-2 gap-1" onClick={onClickSave}>
            <CheckCheck width={14} height={14} />
            保存使用
          </Button>
        </div>
      </div>
    </>
  );
}
