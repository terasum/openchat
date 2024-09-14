import { Suspense } from "react";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
  Input,
  Button,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  TooltipProvider,
} from "@/components/ui";

import { Search, PlusCircle } from "lucide-react";

import { usePrompt } from "@/hooks/use-prompts";

import { PromptList } from "@/components/custom/prompt/components/PromptList";
import { PromptContent } from "@/components/custom/prompt/components/PromptContent";

export function Prompt() {
  const props = usePrompt();
  const { prompts, selectedPrompt, promptCreation, setSelected } = props;

  const onCreateClick = async () => {
    const newPrompt = await promptCreation.create();
    console.log(newPrompt);
    setSelected(newPrompt.id);
  };

  return (
    <TooltipProvider delayDuration={0}>
      <ResizablePanelGroup
        direction="horizontal"
        className="h-full items-stretch"
      >
        <ResizablePanel defaultSize={30} minSize={15}>
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

            <div className="bg-background/95 p-2 pl-4 pr-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <form>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search" className="pl-8" />
                </div>
              </form>
            </div>

            <TabsContent value="all" className="h-[calc(100%-165px)]">
              <Suspense fallback={<div>Loading...</div>}>
                {prompts && (
                  <PromptList
                    props={props}
                  />
                )}
              </Suspense>
            </TabsContent>
            <TabsContent value="favorite" className="h-[calc(100%-165px)]">
              <Suspense fallback={<div>Loading...</div>}>
                {prompts && selectedPrompt && (
                  <PromptList
                    props={props}
                  />
                )}
              </Suspense>
            </TabsContent>

            <div className="bg-background/95 p-2 pl-4 pr-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <div className="flex flex-row flex-1 justify-center">
                <Button
                  variant="default"
                  className="flex  w-[80%]"
                  onClick={() => {
                    onCreateClick();
                  }}
                >
                  <PlusCircle className="h-4 w-4" />{" "}
                  <span className="pl-4">添加</span>
                </Button>
              </div>
            </div>
          </Tabs>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={70} minSize={60}>
          {prompts && selectedPrompt && <PromptContent props={props} />}
        </ResizablePanel>
      </ResizablePanelGroup>
    </TooltipProvider>
  );
}
