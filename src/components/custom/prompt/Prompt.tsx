import { useEffect, useState } from "react";

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

import { PromptList } from "@/components/custom/prompt/components/PromptList";
import { PromptContent } from "@/components/custom/prompt/components/PromptContent";

import { useAppDispatch, useAppSelector } from "@/hooks/use-state";
import {
  setSelectPrompt,
  asyncPromptCreate,
  asyncPromptsFetch,
  asyncPromptActiveFetch,
} from "@/store/prompts";

export function Prompt() {
  const dispatch = useAppDispatch();
  const prompts = useAppSelector((state) => state.prompts.prompts);
  const selectedPrompt = useAppSelector(
    (state) => state.prompts.selectedPrompt
  );

  const [searchKey, setSearchKey] = useState("");

  useEffect(() => {
    dispatch(asyncPromptsFetch());
    dispatch(asyncPromptActiveFetch());
  }, []);

  const setSelected = (id: number) => {
    dispatch(setSelectPrompt(id));
  };

  const onCreateClick = async () => {
    dispatch(asyncPromptCreate());
  };

  return (
    <TooltipProvider delayDuration={0}>
      <ResizablePanelGroup
        direction="horizontal"
        className="h-full items-stretch"
      >
        <ResizablePanel defaultSize={34} minSize={30}>
          <Tabs defaultValue="all" className="h-full">
            <div className="flex items-center px-4 py-2 select-none cursor-default">
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
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search"
                    className="pl-8"
                    autoCorrect="off"
                    autoComplete="off"
                    autoCapitalize="off"
                    value={searchKey}
                    onChange={(e)=> setSearchKey(e.target.value)}
                  />
                </div>
            </div>

            <TabsContent value="all" className="h-[calc(100%-165px)]">
              <PromptList
                prompts={
                  searchKey.length > 0
                    ? prompts.filter((item) => item.title.toLowerCase().includes(searchKey))
                    : prompts
                }
                selectedPrompt={selectedPrompt}
                setSelected={setSelected}
              />
            </TabsContent>

            <TabsContent value="favorite" className="h-[calc(100%-165px)]">
              <PromptList
                prompts={
                  searchKey.length > 0
                    ? prompts.filter(
                        (item) =>
                          item.favorite && item.title.toLowerCase().includes(searchKey)
                      )
                    : prompts.filter((item) => item.favorite)
                }
                selectedPrompt={selectedPrompt}
                setSelected={setSelected}
              />
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
          {prompts && selectedPrompt && <PromptContent />}
        </ResizablePanel>
      </ResizablePanelGroup>
    </TooltipProvider>
  );
}
