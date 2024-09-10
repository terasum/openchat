import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

import { TooltipProvider } from "@/components/ui/tooltip";
import { type Prompt } from "@/hooks/prompts-data";

import { SettingsNav } from "@/components/custom/settings/settings-nav";
import { useSettingsNavigator } from "@/hooks/use-app-settings-navigator";
import ModelSettings from "@/components/custom/settings/settings-model";
import AppSettings from "@/components/custom/settings/settings-app";
import AboutSettings from "@/components/custom/settings/settings-about";
import AccountSettings from "@/components/custom/settings/settings-account";


export default function Prompt() {
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
        <ResizablePanel defaultSize={25} minSize={20}>
          <div>
            <div className="flex flex-col px-4 py-2 h-[52px] items-start justify-center">
              <h1 className="text-xl font-bold">Settings</h1>
            </div>
            <SettingsNav />
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={75} minSize={70}>
          <div className="flex flex-1 h-full overflow-y-auto p-4">
            {settingsLinkConfig.selected == 0 && <ModelSettings />}
            {settingsLinkConfig.selected == 1 && <AccountSettings />}
            {settingsLinkConfig.selected == 2 && <AppSettings />}
            {settingsLinkConfig.selected == 3 && <AboutSettings />}
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </TooltipProvider>
  );
}