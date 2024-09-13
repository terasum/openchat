import { Suspense } from "react";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
  Input,
  Separator,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  TooltipProvider,
} from "@/components/ui";

import { Search } from "lucide-react";

import { PromptDisplay } from "@/components/custom/prompt/PromptDisplay";
import { PromptList } from "@/components/custom/prompt/PromptList";
import { usePrompt } from "@/hooks/use-prompts";

export function Prompt() {
  const { query } = usePrompt();
  const { data, isPending, isError } = query;
  const prompts = data;

  return (
    <TooltipProvider delayDuration={0}>
      <ResizablePanelGroup
        direction="horizontal"
        className="h-full items-stretch"
      >
        <ResizablePanel defaultSize={30} minSize={30}>
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
              <Suspense fallback={<div>Loading...</div>}>
                {prompts && <PromptList items={prompts} />}
              </Suspense>
            </TabsContent>
            <TabsContent value="favorite" className="h-[calc(100%-120px)]">
              <Suspense fallback={<div>Loading...</div>}>
                {prompts && (
                  <PromptList items={prompts.filter((item) => item.favorite)} />
                )}
              </Suspense>
            </TabsContent>
          </Tabs>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={70} minSize={60}>
          {!isPending && !isError && <PromptDisplay />}
        </ResizablePanel>
      </ResizablePanelGroup>
    </TooltipProvider>
  );
}
