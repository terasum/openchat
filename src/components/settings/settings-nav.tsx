import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/store";
import { setSettingsNav } from "@/store/settings";
import { Brain, AppWindow, CircleHelp, AppWindowMac } from "lucide-react";
export function SettingsNav() {
  const dispatch = useAppDispatch();
  const settingsLinkConfig = useAppSelector((state) => state.settingNav);
  const setSettingsLinkConfig = (config: typeof settingsLinkConfig) =>
    dispatch(setSettingsNav(config));

  const renderIcon = (icon: string) => {
    switch (icon) {
      case "Brain":
        return <Brain className="mr-2 h-4 w-4"/>;
      case "AppWindow":
        return <AppWindow className="mr-2 h-4 w-4"/>;
      case "CircleHelp":
        return <CircleHelp className="mr-2 h-4 w-4" />;
      default:
        return <AppWindowMac className="mr-2 h-4 w-4" />;
    }
  };

  return (
    <div
      data-collapsed={false}
      className="group flex flex-col gap-4 py-2 data-[collapsed=true]:py-2"
    >
      <nav className="grid gap-1 px-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2">
        {settingsLinkConfig.links.map((link, _index) => (
          <Button
            key={link.id}
            size={"sm"}
            variant={
              settingsLinkConfig.selected === link.id ? "outline" : "ghost"
            }
            className={cn(
              "text-left justify-start text-gray-500",
              settingsLinkConfig.selected === link.id &&
                "text-accent-foreground"
            )}
            onClick={() =>
              setSettingsLinkConfig({
                ...settingsLinkConfig,
                selected: link.id,
              })
            }
          >
            {renderIcon(link.icon)}
            {link.title}
          </Button>
        ))}
      </nav>
    </div>
  );
}
