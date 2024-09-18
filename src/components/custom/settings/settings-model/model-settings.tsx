import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Switch,
  Card,
  CardHeader,
  CardDescription,
  CardContent,
  CardFooter,
  CardTitle,
  Input,
} from "@/components/ui";
import { HelpCircle, Brain, Key, Globe, Route } from "lucide-react";

import { SettingsItem } from "../components/settings-item";

import { useAppDispatch, useAppSelector } from "@/hooks/use-state";
import { SettingsModel } from "@/model";
import { asyncUpdateConfig } from "@/store/app-config";

export function DisplayForm() {

  const config = useAppSelector((state) => state.appConfig);
  const dispatch = useAppDispatch();
  const setConfig = (config: SettingsModel) =>{
    console.log("dispatching app-config", config);
    dispatch(asyncUpdateConfig(config));
  }

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
              value={config.model.default_model}
              onValueChange={(value) => {
                console.log("settings changed:", {
                  default_model: value,
                });
                setConfig({
                  ...config,
                  model: {
                    ...config.model,
                    default_model: value,
                  },
                });
              }}
            >
              <SelectTrigger className="w-[100%]">
                <SelectValue placeholder="Select a model" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="gpt-4o-mini">GPT-4o-mini</SelectItem>
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
            checked={config.model.enable_memory}
            onCheckedChange={(checked) => {
              console.log("settings changed:", { enable_memory: checked });
              setConfig({
                ...config,
                model: {
                  ...config.model,
                  enable_memory: checked,
                },
              });
            }}
          />
        </SettingsItem>

        {/* <SettingsItem
          title="最大Token长度"
          description="包括输入输出的 Token 长度"
          icon={MessageSquareCode}
        >
          <div className="flex flex-row justify-between items-center w-[200px]">
            <Label htmlFor="slider-input">
              {config.model.max_token_length[0]}
            </Label>

            <Slider
              id="slider-input"
              value={config.model.max_token_length}
              max={2500}
              step={50}
              disabled={true}
              defaultValue={[2500]}
              className={cn("w-[160px]")}
              onValueChange={(value) => {
                console.log("settings changed:", { max_token_length: value });
                setConfig({
                  ...config,
                  model: {
                    ...config.model,
                    max_token_length: value,
                  },
                });
              }}
            />
          </div>
        </SettingsItem> */}

        {/* <SettingsItem
          title="思维发散程度"
          description="即 temperature, 取值范围 0-2"
          icon={Sparkles}
        >
          <div className="flex flex-row justify-between items-center w-[200px]">
            <Label htmlFor="slider-input">{config.model.temperature[0]}</Label>

            <Slider
              id="slider-input"
              max={2}
              step={0.1}
              className={cn("w-[160px]")}
              value={config.model.temperature}
              defaultValue={[0.8]}
              disabled={true}
              onValueChange={(value) => {
                console.log("settings changed:", { temperature: value });
                setConfig({
                  ...config,
                  model: {
                    ...config.model,
                    temperature: value,
                  },
                });
              }}
            />
          </div>
        </SettingsItem> */}

        <SettingsItem title="API 域名" description="支持https协议" icon={Globe}>
          <div className="flex flex-col justify-center items-center w-[300px]">
            <Input
              className="w-[100%]"
              type="text"
              placeholder="https://proxy.openchat.dev"
              value={config.apikey.domain}
              onChange={(e) => {
                console.log("settings changed:", { domain: e.target.value });
                setConfig({
                  ...config,
                  apikey: {
                    ...config.apikey,
                    domain: e.target.value,
                  },
                });
              }}
            />
          </div>
        </SettingsItem>
        <SettingsItem
          title="API 路径"
          description="仅支持流式请求"
          icon={Route}
        >
          <div className="flex flex-col justify-center items-center w-[300px]">
            <Input
              className="w-[100%]"
              type="text"
              placeholder="/chat/complements"
              value={config.apikey.path}
              onChange={(e) => {
                console.log("settings changed:", { path: e.target.value });
                setConfig({
                  ...config,
                  apikey: {
                    ...config.apikey,
                    path: e.target.value,
                  },
                });
              }}
            />
          </div>
        </SettingsItem>
        {/* <SettingsItem title="UserAgent" icon={Compass}>
          <div className="flex flex-col justify-center items-center w-[300px]">
            <Input
              className="w-[100%]"
              type="text"
              placeholder="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36"
              value={config.apikey.user_agent}
              onChange={(e) => {
                console.log("settings changed:", {
                  user_agent: e.target.value,
                });
                setConfig({
                  ...config,
                  apikey: {
                    ...config.apikey,
                    user_agent: e.target.value,
                  },
                });
              }}
            />
          </div>
        </SettingsItem> */}
        <SettingsItem
          title="API Key"
          description="获取方式见下方说明"
          icon={Key}
        >
          <div className="flex flex-col justify-center items-center w-[300px]">
            <Input
              className="w-[100%]"
              type="text"
              placeholder="SK-<your-key-here>..."
              value={config.apikey.apikey}
              onChange={(e) => {
                console.log("settings changed:", { apikey: e.target.value });
                setConfig({
                  ...config,
                  apikey: {
                    ...config.apikey,
                    apikey: e.target.value,
                  },
                });
              }}
            />
          </div>
        </SettingsItem>
      </CardContent>
      <CardFooter className="justify-end"></CardFooter>
    </Card>
  );
}
