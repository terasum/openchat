import { Star, StarOff, Copy, Tag, Trash, Check } from "lucide-react";
import {
  Button,
  Separator,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui";

import { ask } from "@tauri-apps/api/dialog";

import { Prompt } from "@/rust-bindings";

import { useAppSelector, useAppDispatch } from "@/hooks/use-state";

import {
  asyncPromptDelete,
  asyncPromptUpdate,
  asyncPromptActiveSet,
} from "@/store/prompts";

export function PromptToolbar() {
  const dispatch = useAppDispatch();
  const prompts = useAppSelector((state) => state.prompts.prompts);

  const activatedPrompt = useAppSelector(
    (state) => state.prompts.activatedPrompt
  );

  const selectedPrompt = useAppSelector(
    (state) => state.prompts.selectedPrompt
  );

  const onActiveClick = (id: number) => {
    new Promise(async () => {
      const sure = await ask(`确定激活 Prompt ${id}?`, {
        title: "确认",
        type: "info",
      });
      if (sure) {
        dispatch(asyncPromptActiveSet(id));
      }
    });
  };

  const onDeleteClick = (prompt: Prompt) => {
    if (!prompt) return;
    if (prompts.length <= 1) {
      alert("无法删除最后一个prompt");
      return;
    }
    new Promise(async () => {
      const sure = await ask(`确定删除 Prompt ${prompt.id}?`, {
        title: "删除",
        type: "warning",
      });
      if (sure) {
        dispatch(asyncPromptDelete(prompt.id));
      }
    });
  };

  const onCopyClick = (prompt: Prompt) => {
    navigator.clipboard
      .writeText(prompt.system)
      .then(() => {
        alert("内容已复制到剪贴板！");
      })
      .catch((err) => {
        console.error("复制失败：", err);
      });
  };

  const onFavoriteClick = () => {
    dispatch(
      asyncPromptUpdate({
        ...selectedPrompt,
        favorite: !selectedPrompt.favorite,
      })
    );
  };

  return (
    <div className="flex flex-row items-center p-2 h-[52px] flex-1">
      <div className="flex items-center gap-2 mr-6">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              disabled={selectedPrompt?.id == 1}
              onClick={() => {
                onFavoriteClick();
              }}
            >
              {selectedPrompt.favorite ? (
                <StarOff className="h-4 w-4" />
              ) : (
                <Star className="h-4 w-4" />
              )}
              <span className="sr-only">收藏</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>收藏</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onCopyClick(selectedPrompt)}
            >
              <Copy className="h-4 w-4" />
              <span className="sr-only">复制</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>复制</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" disabled={true}>
              <Tag className="h-4 w-4" />
              <span className="sr-only">添加标签</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>添加标签</TooltipContent>
        </Tooltip>
        <Separator orientation="vertical" className="mx-2 h-6" />
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                onDeleteClick(selectedPrompt);
              }}
            >
              <Trash className="h-4 w-4" />
              <span className="sr-only">删除</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>删除</TooltipContent>
        </Tooltip>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              disabled={selectedPrompt.id == activatedPrompt.id}
              onClick={() => {
                onActiveClick(selectedPrompt.id);
              }}
            >
              <Check className="h-4 w-4" />
              <span className="sr-only">激活</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>激活</TooltipContent>
        </Tooltip>
      </div>

      {/* <Button
        variant="default"
        size="icon"
        disabled={prompt!.actived}
        onClick={() => onActiveClick(prompt!)}
      >
        <span className="">{prompt!.actived ? "禁用" : "激活"}</span>
      </Button> */}
    </div>
  );
}
