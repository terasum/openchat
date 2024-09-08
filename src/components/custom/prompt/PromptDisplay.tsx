import { Badge } from "@/components/ui";
import {
  // Archive,
  // MoreVertical,
  Trash2,
  Star,
  CheckCheck,
  Save,
  Copy,
} from "lucide-react";

// import {
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenu,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { Prompt } from "@/hooks/prompts-data";

import { usePrompt } from "@/hooks/use-prompts";

interface PromptDisplayProps {
  prompt: Prompt | null;
}

import { ComponentProps } from "react";

function getBadgeVariantFromLabel(
  label: string
): ComponentProps<typeof Badge>["variant"] {
  if (["work"].includes(label.toLowerCase())) {
    return "outline";
  }

  if (["personal"].includes(label.toLowerCase())) {
    return "outline";
  }

  return "outline";
}

export function PromptDisplay({ prompt }: PromptDisplayProps) {
  const [selectedPrompt, setSelectedPrompt] = usePrompt();

  const handlePromptActiveClick = (prompt: Prompt) => {
    setSelectedPrompt({ actived: prompt?.id, selected: prompt?.id });
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center p-2 h-[52px]">
        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" disabled={!prompt}>
                <Save className="h-4 w-4" />
                <span className="sr-only">保存</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>保存</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" disabled={!prompt}>
                <Star className="h-4 w-4" />
                <span className="sr-only">收藏</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>收藏</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" disabled={!prompt}>
                <Copy className="h-4 w-4" />
                <span className="sr-only">复制</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>复制</TooltipContent>
          </Tooltip>
          {selectedPrompt.actived === prompt?.id ? (
            <Badge variant={"default"}>{"active"}</Badge>
          ) : (
            <Badge variant={"outline"}>{"unused"}</Badge>
          )}
        </div>
        <div className="ml-auto flex items-center gap-2"></div>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" disabled={!prompt}>
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">删除</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>删除</TooltipContent>
        </Tooltip>
      </div>
      <Separator />
      {prompt ? (
        <div className="flex flex-1 flex-col h-[calc(100%-52px)] overflow-hidden">
          <div className="flex items-start p-4 h-[86px]">
            <div className="flex items-start gap-4 text-sm">
              <div className="grid gap-1">
                <div className="font-semibold">{prompt.name}</div>
                <div className="line-clamp-1 text-xs text-gray-500">{prompt.desc}</div>
                {prompt.labels.length ? (
                  <div className="flex items-center gap-2">
                    {prompt.labels.map((label) => (
                      <Badge
                        key={label}
                        variant={getBadgeVariantFromLabel(label)}
                      >
                        {label}
                      </Badge>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
          </div>
          <Separator />
          <div className="flex-1 whitespace-pre-wrap p-4 text-sm h-[calc(100%-150px)] overflow-y-auto">
            <p>{prompt.text}</p>
          </div>
          <Separator className="mt-auto" />
          <div className="p-4  h-[64px] bg-white">
            <form>
              <div className="grid gap-4">
                <div className="flex items-center">
                  <Label
                    htmlFor="mute"
                    className="flex items-center gap-2 text-xs font-normal"
                  >
                    <Switch id="mute" aria-label="Mute thread" /> 上下文记忆
                  </Label>
                  <Button
                    onClick={(e) => {
                      e.preventDefault();
                      handlePromptActiveClick(prompt);
                    }}
                    size="sm"
                    className="ml-auto"
                  >
                    <CheckCheck className="h-4 w-4" />
                    &nbsp;使用
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <div className="p-8 text-center text-muted-foreground h-[calc(100%-52px)] overflow-hidden">
          No message selected
        </div>
      )}
    </div>
  );
}
