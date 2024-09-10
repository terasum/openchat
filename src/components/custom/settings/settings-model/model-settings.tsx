import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Switch,
  Label,
  Card,
  CardHeader,
  CardDescription,
  CardContent,
  CardFooter,
  CardTitle,
  Slider,
} from "@/components/ui";
import { cn } from "@/lib/utils";
import { MessageSquareCode, Sparkles, HelpCircle, Brain } from "lucide-react";

import { SettingsItem } from "../components/settings-item";

import { useAppSettings } from "@/hooks/use-app-settings";

export function DisplayForm() {
  const appSettings = useAppSettings();
  return (
    <Card className="rounded-none border-none shadow-none h-full overflow-y-auto">
      <CardHeader>
        <CardTitle className="text-lg">模型设置</CardTitle>
        <CardDescription>Models</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <SettingsItem title="默认模型" icon={Brain}>
          <div className="flex flex-col justify-center items-center w-[200px]">
            <Select
              value={appSettings.model.default_model}
              onValueChange={(value) => {
                appSettings.model.default_model = value;
              }}
            >
              <SelectTrigger className="w-[100%]">
                <SelectValue placeholder="Select a model" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="gpt-4o-mini">GPT-4o-mini</SelectItem>
                  <SelectItem value="gpt-3.5-turbo">GPT-3.5-turbo</SelectItem>
                  <SelectItem value="wenxin-3.5">文心一言3.5</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </SettingsItem>

        <SettingsItem
          title="上下文记忆"
          description="启用上下文记忆可以实现多轮对话"
          icon={HelpCircle}
        >
          <Switch
            checked={appSettings.model.enable_memory}
            onCheckedChange={(checked) => {
              appSettings.model.enable_memory = checked;
            }}
          />
        </SettingsItem>

        <SettingsItem
          title="最大Token长度"
          description="包括输入输出的 Token 长度"
          icon={MessageSquareCode}
        >
          <div className="flex flex-row justify-between items-center w-[200px]">
            <Label htmlFor="slider-input">
              {appSettings.model.max_token_length[0]}
            </Label>

            <Slider
              id="slider-input"
              defaultValue={appSettings.model.max_token_length}
              max={2000}
              step={50}
              className={cn("w-[160px]")}
              onValueChange={(value) => {
                appSettings.model.max_token_length = value;
              }}
            />
          </div>
        </SettingsItem>

        <SettingsItem
          title="思维发散程度"
          description="即 temperature, 取值范围 0-2"
          icon={Sparkles}
        >
          <div className="flex flex-row justify-between items-center w-[200px]">
            <Label htmlFor="slider-input">
              {appSettings.model.temperature[0]}
            </Label>

            <Slider
              id="slider-input"
              defaultValue={appSettings.model.temperature}
              max={2}
              step={0.1}
              className={cn("w-[160px]")}
              onValueChange={(value) => {
                appSettings.model.temperature = value;
              }}
            />
          </div>
        </SettingsItem>
      </CardContent>
      <CardFooter className="justify-end"></CardFooter>
    </Card>
  );
}
