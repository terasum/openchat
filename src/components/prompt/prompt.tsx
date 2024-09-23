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
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui";

import { Search, PlusCircle, DownloadCloud } from "lucide-react";

import { PromptList } from "@/components/prompt/components/prompt-list";
import { PromptContent } from "@/components/prompt/components/prompt-content";

import { useAppDispatch, useAppSelector } from "@/store";

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

  const [openDownloadDialog, setOpenDownloadDialog] = useState(false);

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

  const onDownloadClick = async () => {
    setOpenDownloadDialog(true);
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
                  onContextMenu={(e) => {
                    e.stopPropagation();
                  }}
                  placeholder="Search"
                  className="pl-8"
                  autoCorrect="off"
                  autoComplete="off"
                  autoCapitalize="off"
                  value={searchKey}
                  onChange={(e) => setSearchKey(e.target.value)}
                />
              </div>
            </div>

            <TabsContent value="all" className="h-[calc(100%-165px)]">
              <PromptList
                prompts={
                  searchKey.length > 0
                    ? prompts.filter((item) =>
                        item.title.toLowerCase().includes(searchKey)
                      )
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
                          item.favorite &&
                          item.title.toLowerCase().includes(searchKey)
                      )
                    : prompts.filter((item) => item.favorite)
                }
                selectedPrompt={selectedPrompt}
                setSelected={setSelected}
              />
            </TabsContent>

            <div className="bg-background/95 p-2 pl-4 pr-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <div className="flex flex-row flex-1 justify-between">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      className="flex  w-[45%] bg-[#F2F5F9]"
                      onClick={() => {
                        onDownloadClick();
                      }}
                    >
                      <DownloadCloud className="h-4 w-4" />{" "}
                      <span className="pl-4">下载</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>从 OpenChat Could 下载Prompt</TooltipContent>
                </Tooltip>

                <Button
                  variant="outline"
                  className="flex  w-[45%] bg-[#F2F5F9]"
                  onClick={() => {
                    onCreateClick();
                  }}
                >
                  <PlusCircle className="h-4 w-4" />{" "}
                  <span className="pl-4">添加</span>
                </Button>
              </div>
            </div>

            <AlertDialog
              open={openDownloadDialog}
              onOpenChange={setOpenDownloadDialog}
            >
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>从云上下载Prompt</AlertDialogTitle>
                  <AlertDialogDescription>
                    <div className="bg-red">
                      <div className="">
                        请将您要下载的Prompt ID 粘贴到下方，例如：
                        <div className="text-center">
                          <div className="bg-[#F2F5F9] p-2 mt-2 rounded-md">
                            <span className="text-[#555555]">
                              {"PID_STD_A192K183"}
                              <span className="text-[#F2F5F9]">{""}</span>
                            </span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <Input
                          placeholder="Prompt ID"
                          className="mt-2"
                          autoCorrect="off"
                          autoComplete="off"
                          autoCapitalize="off"
                        />
                      </div>
                    </div>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>取消</AlertDialogCancel>
                  <AlertDialogAction>下载</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
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
