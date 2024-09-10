import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useSettingsNavigator } from "@/hooks/use-app-settings-navigator";

export function SettingsNav() {
  const [settingsLinkConfig, setSettingsLinkConfig] = useSettingsNavigator();

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
            variant={ settingsLinkConfig.selected === link.id? "outline" : "ghost"}
            className={cn(
              "text-left justify-start text-gray-500",
              settingsLinkConfig.selected === link.id && "text-accent-foreground"
            )}
            onClick={() =>
              setSettingsLinkConfig({ ...settingsLinkConfig, selected: link.id })
            }
          >
            <link.icon className="mr-2 h-4 w-4" />
            {link.title}
          </Button>
        ))}
      </nav>
    </div>
  );
}
