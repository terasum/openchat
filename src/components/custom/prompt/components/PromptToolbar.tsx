import { Star, StarOff, MoreVertical, Copy, DownloadCloud, Tag } from "lucide-react";

import {
  Button,
  Separator,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  Input,
} from "@/components/ui";

import { Prompt } from "@/rust-bindings";

import { usePrompt } from "@/hooks/use-prompts";

export function PromptToolbar() {
  const { query, selected, setActivated, mutation } = usePrompt();
  const { data } = query;
  const prompts = data;

  const prompt =
    prompts?.find((p) => p.id === selected) || prompts ? prompts[0] : undefined;

  // const onActiveClick = (prompt: Prompt) => {
  //   if (!prompt) return;
  //   setActivated(prompt.id);
  //   mutation.mutate({
  //     ...prompt,
  //     actived: !prompt.actived,
  //   });
  // };

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

  const onFavoriteClick = (prompt: Prompt) => {
    if (!prompt) return;
    setActivated(prompt.id);
    mutation.mutate({
      ...prompt,
      favorite: !prompt.favorite,
    });
  };

  return (
    <div className="flex items-center p-2 h-[52px]">
      <div className="flex items-center gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              disabled={!prompt}
              onClick={() => {
                onFavoriteClick(prompt!);
              }}
            >
              {prompt!.favorite ? (
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
              disabled={!prompt}
              onClick={() => onCopyClick(prompt!)}
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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-4 w-4" />
              <span className="sr-only">More</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem disabled={true}>删除</DropdownMenuItem>
            <DropdownMenuItem disabled={true}>添加标签</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <Input disabled={true} placeholder="https://<prompt url>"></Input>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" disabled={true}>
              <DownloadCloud className="h-4 w-4" />
              <span className="sr-only">删除</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>删除</TooltipContent>
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
