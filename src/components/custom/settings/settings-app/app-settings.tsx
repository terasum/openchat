import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import { Languages } from "lucide-react";

import { cn } from "@/lib/utils";
import { SettingsItem } from "../components/settings-item";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  Button,
  Card,
  CardHeader,
  CardDescription,
  CardContent,
  CardFooter,
  CardTitle,
  // Label,
} from "@/components/ui";

const languages = [
  // { label: "English", value: "en" },
  { label: "中文简体", value: "zh_CN" },
] as const;

import { useAppSelector } from "@/hooks/use-state";

export function AppearanceSettings() {

  const config = useAppSelector((state) => state.appConfig);


  return (
    <Card className="rounded-none border-none shadow-none">
      <CardHeader>
        <CardTitle className="text-lg">外观设置</CardTitle>
        <CardDescription> Apperence</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <SettingsItem title="语言" icon={Languages}>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                className={cn(
                  "w-[200px] justify-between",
                  !config.appearance.language && "text-muted-foreground"
                )}
              >
                {config.appearance.language
                  ? languages.find(
                      (language) =>
                        language.value === config.appearance.language
                    )?.label
                  : "选择语言"}
                <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
              <Command>
                <CommandInput placeholder="选择语言..." />
                <CommandList>
                  <CommandEmpty>No language found.</CommandEmpty>
                  <CommandGroup>
                    {languages.map((language) => (
                      <CommandItem
                        value={language.label}
                        key={language.value}
                        onSelect={() => {
                          config.appearance.language = language.value;
                        }}
                      >
                        <CheckIcon
                          className={cn(
                            "mr-2 h-4 w-4",
                            language.value === config.appearance.language
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        {language.label}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </SettingsItem>

        {/* <SettingsItem title="主题" icon={AppWindow} className="h-[120px]">
          <RadioGroup defaultValue="comfortable" className="flex flex-row">
            <div className="flex flex-col">
              <Label htmlFor="r1" className="">
                <div className="flex items-center space-x-2  cursor-pointer">
                  <div className="items-center rounded-md border-2 border-muted p-1 hover:border-accent">
                    <div className="space-y-2 rounded-sm bg-[#ecedef] p-2">
                      <div className="space-y-2 rounded-md bg-white p-2 shadow-sm">
                        <div className="h-1 w-[40px] rounded-lg bg-[#ecedef]" />
                        <div className="h-1 w-[50px] rounded-lg bg-[#ecedef]" />
                      </div>
                      <div className="flex items-center space-x-2 rounded-md bg-white p-2 shadow-sm">
                        <div className="h-2 w-2 rounded-full bg-[#ecedef]" />
                        <div className="h-1 w-[50px] rounded-lg bg-[#ecedef]" />
                      </div>
                    </div>
                    <div className="flex flex-row mt-1 mb-1 justify-center items-center w-full"></div>
                  </div>
                </div>
              </Label>
              <RadioGroupItem value="light" id="r1" className="mr-2 hidden" />
            </div>

            <div className="flex flex-col">
              <Label htmlFor="r2" className="">
                <div className="flex items-center space-x-2 cursor-pointer">
                  <div className="items-center rounded-md border-2 border-muted bg-popover p-1 hover:bg-accent hover:text-accent-foreground">
                    <div className="space-y-2 rounded-sm bg-slate-950 p-2">
                      <div className="space-y-2 rounded-md bg-slate-800 p-2 shadow-sm">
                        <div className="h-1 w-[40px] rounded-lg bg-slate-400" />
                        <div className="h-1 w-[50px] rounded-lg bg-slate-400" />
                      </div>
                      <div className="flex items-center space-x-2 rounded-md bg-slate-800 p-2 shadow-sm">
                        <div className="h-2 w-2 rounded-full bg-slate-400" />
                        <div className="h-2 w-[50px] rounded-lg bg-slate-400" />
                      </div>
                    </div>
                    <div className="flex flex-row mt-1 mb-1 justify-center items-center w-full"></div>
                  </div>
                </div>
              </Label>
              <RadioGroupItem value="dark" id="r2" className="mr-2" hidden />
            </div>
          </RadioGroup>
        </SettingsItem> */}
      </CardContent>
      <CardFooter className="justify-end"></CardFooter>
    </Card>
  );
}
