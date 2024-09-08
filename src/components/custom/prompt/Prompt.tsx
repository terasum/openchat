import { Search } from "lucide-react";

import { Input } from "@/components/ui";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { TooltipProvider } from "@/components/ui/tooltip";
import { PromptDisplay } from "@/components/custom/prompt/PromptDisplay";
import { PromptList } from "@/components/custom/prompt/PromptList";
import { type Prompt } from "@/hooks/prompts-data";
import { usePrompt } from "@/hooks/use-prompts";

interface PromptProps {
  prompt: Prompt[];
  defaultLayout: number[] | undefined;
}

export function Prompt({ prompt, defaultLayout = [25, 75] }: PromptProps) {

  const [prompt_select] = usePrompt();

  return (
    <TooltipProvider delayDuration={0}>
      <ResizablePanelGroup
        direction="horizontal"
        onLayout={(sizes: number[]) => {
          document.cookie = `openchat:layout:prompt=${JSON.stringify(
            sizes
          )}`;
        }}
        className="h-full items-stretch"
      >
        <ResizablePanel defaultSize={defaultLayout[0]} minSize={40}>
          <Tabs defaultValue="all" className="h-full">
            <div className="flex items-center px-4 py-2">
              <h1 className="text-xl font-bold">Prompts</h1>
              <TabsList className="ml-auto">
                <TabsTrigger
                  value="all"
                  className="text-zinc-600 dark:text-zinc-200"
                >
                  全部
                </TabsTrigger>
                <TabsTrigger
                  value="favorite"
                  className="text-zinc-600 dark:text-zinc-200"
                >
                  收藏
                </TabsTrigger>
              </TabsList>
            </div>
            <Separator />
            <div className="bg-background/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <form>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search" className="pl-8" />
                </div>
              </form>
            </div>
            <TabsContent value="all" className="m-0 h-[calc(100%-120px)]">
              <PromptList items={prompt} />
            </TabsContent>
            <TabsContent value="favorite" className="h-[calc(100%-120px)]">
              <PromptList items={prompt.filter((item) => item.favoriate)} />
            </TabsContent>
          </Tabs>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={defaultLayout[1]} minSize={30}>
          <PromptDisplay
            prompt={
              prompt.find((item) => item.id === prompt_select.selected) || null
            }
          />
        </ResizablePanel>
      </ResizablePanelGroup>
    </TooltipProvider>
  );
}
