import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

import { TooltipProvider } from "@/components/ui/tooltip";
import { type Prompt } from "@/hooks/prompts-data";

import { SettingsNav } from "@/components/custom/settings/settings-nav";
import { useSettingsNavigator } from "@/hooks/use-settings-navigator";
import ModelSettings from "@/components/custom/settings/settings-model";
import AppSettings from "@/components/custom/settings/settings-app";
import AboutSettings from "@/components/custom/settings/settings-about";
import AccountSettings from "@/components/custom/settings/settings-account";

interface PromptProps {
  defaultLayout: number[] | undefined;
}

export default function Prompt({ defaultLayout = [20, 75] }: PromptProps) {
  const [settingsLinkConfig, setSettingsLinkConfig] = useSettingsNavigator();
  return (
    <TooltipProvider delayDuration={0}>
      <ResizablePanelGroup
        direction="horizontal"
        onLayout={(sizes: number[]) => {
          document.cookie = `openchat:layout:prompt=${JSON.stringify(sizes)}`;
        }}
        className="h-full items-stretch"
      >
        <ResizablePanel defaultSize={defaultLayout[0]} minSize={15}>
          <div>
            <div className="flex flex-col px-4 py-2 h-[52px] items-start justify-center">
              <h1 className="text-xl font-bold">Settings</h1>
            </div>
            <SettingsNav />
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={defaultLayout[1]} minSize={60}>
          <div className="flex flex-1 h-full overflow-y-auto p-4">
            {settingsLinkConfig.selected == 0 && <ModelSettings />}
            {settingsLinkConfig.selected == 1 && <AppSettings />}
            {settingsLinkConfig.selected == 2 && <AccountSettings />}
            {settingsLinkConfig.selected == 3 && <AboutSettings />}
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </TooltipProvider>
  );
}
