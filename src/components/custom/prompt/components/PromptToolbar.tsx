import { Star, CheckCheck, MoreVertical } from "lucide-react";

import {
  Button,
  Separator,
  Tooltip,
  TooltipContent,
  Badge,
  TooltipTrigger,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui";

import { Prompt } from "@/rust-bindings";

import { usePrompt } from "@/hooks/use-prompts";

export function PromptToolbar() {
  const { query, selected, setActivated, setSelected } = usePrompt();
  const { data } = query;
  const prompts = data;

  const prompt =
    prompts?.find((p) => p.id === selected) || prompts ? prompts[0] : undefined;

  const onActiveClick = (prompt: Prompt) => {
    if (!prompt) return;
    setActivated(prompt.id);
    setSelected(prompt.id);
  };

  return (
    <div className="flex items-center p-2 h-[52px]">
      <div className="flex items-center gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" disabled={!prompt}>
              <Star className="h-4 w-4" />
              <span className="sr-only">收藏</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>收藏</TooltipContent>
        </Tooltip>

        {/* <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" disabled={!prompt}>
                <Copy className="h-4 w-4" />
                <span className="sr-only">复制</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>复制</TooltipContent>
          </Tooltip> */}

        <Separator orientation="vertical" className="mx-2 h-6" />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-4 w-4" />
              <span className="sr-only">More</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>删除</DropdownMenuItem>
            <DropdownMenuItem>添加标签</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="ml-auto flex items-center gap-2"></div>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="default"
            size="icon"
            disabled={!prompt}
            onClick={() => onActiveClick(prompt!)}
          >
            <CheckCheck className="h-4 w-4" />
            <span className="sr-only">激活</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>激活</TooltipContent>
      </Tooltip>
    </div>
  );
}

function PromptMeta() {
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
