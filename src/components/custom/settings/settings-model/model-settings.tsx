import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Card,
  CardHeader,
  CardDescription,
  CardContent,
  CardFooter,
  CardTitle,
  Input,
} from "@/components/ui";
import { Brain, Key, Globe, Compass, Sparkle } from "lucide-react";

import { SettingsItem } from "../components/settings-item";

import { useAppDispatch, useAppSelector } from "@/store";
import { AppConfig } from "@/model";
import { asyncUpdateConfig } from "@/store/app-config";

export function DisplayForm() {
  const config = useAppSelector((state) => state.appConfig);
  const dispatch = useAppDispatch();
  const setConfig = (config: AppConfig) => {
    console.log("dispatching app-config", config);
    dispatch(asyncUpdateConfig(config));
  };

  const getApiUrl = (model_provider: string) => {
    switch (model_provider) {
      case "openchat":
        return {
          url: "https://proxy.openchat.dev/v1/chat/completions",
          models: ["gpt-4o-mini"],
        };
      case "openai":
        return {
          url: "https://api.openai.com/v1/chat/completions",
          models: ["gpt-4o-mini"],
        };
      case "ollama":
        return {
          url: "http://localhost:11434/v1/chat/completions",
          models: ["tinyllama"],
        };
      default:
        return {
          url: "",
          models: [""],
        };
    }
  };

  return (
    <Card className="rounded-none border-none shadow-none h-full overflow-y-auto">
      <CardHeader>
        <CardTitle className="text-lg">模型设置</CardTitle>
        <CardDescription>Models</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <SettingsItem title="模型提供商" icon={Sparkle}>
          <div className="flex flex-col justify-center items-center w-[200px]">
            <Select
              value={config.model.model_provider}
              onValueChange={(value) => {
                console.log("settings changed:", {
                  provider: value,
                });
                setConfig({
                  ...config,
                  model: {
                    ...config.model,
                    model_provider: value,
                    api_url: getApiUrl(value).url,
                  },
                });
              }}
            >
              <SelectTrigger className="w-[100%]">
                <SelectValue placeholder="Select a model" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="openchat">OpenChat</SelectItem>
                  <SelectItem value="openai">OpenAI</SelectItem>
                  <SelectItem value="ollama">Ollama</SelectItem>
                  <SelectItem value="user">自定义</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </SettingsItem>
        <SettingsItem title="默认模型" icon={Brain}>
          <div className="flex flex-col justify-center items-center w-[200px]">
            <Select
              value={config.model.model_name}
              onValueChange={(value) => {
                console.log("settings changed:", {
                  model_name: value,
                });
                setConfig({
                  ...config,
                  model: {
                    ...config.model,
                    model_name: value,
                  },
                });
              }}
            >
              <SelectTrigger className="w-[100%]">
                <SelectValue placeholder="Select a model" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {getApiUrl(config.model.model_provider).models.map(
                    (model, index) => {
                      return (
                        <SelectItem key={index} value={model}>
                          {model}
                        </SelectItem>
                      );
                    }
                  )}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </SettingsItem>

        <SettingsItem title="API地址" description="支持https协议" icon={Globe}>
          <div className="flex flex-col justify-center items-center w-[300px]">
            <Input
              className="w-[100%]"
              type="text"
              placeholder=""
              onContextMenu={(e)=>{
                e.stopPropagation();
              }}
              defaultValue={config.model.api_url}
              disabled={config.model.model_provider !== "user"}
              onChange={(e) => {
                console.log("settings changed:", { domain: e.target.value });
                setConfig({
                  ...config,
                  model: {
                    ...config.model,
                    api_url: e.target.value,
                  },
                });
              }}
            />
          </div>
        </SettingsItem>
        <SettingsItem title="API Key" description="如何获取见说明" icon={Key}>
          <div className="flex flex-col justify-center items-center w-[300px]">
            <Input
              className="w-[100%]"
              type="text"
              placeholder="SK-<your-key-here>..."
              defaultValue={config.model.api_key}
              onContextMenu={(e)=>{
                e.stopPropagation();
              }}
              onChange={(e) => {
                console.log("settings changed:", { apikey: e.target.value });
                setConfig({
                  ...config,
                  model: {
                    ...config.model,
                    api_key: e.target.value,
                  },
                });
              }}
            />
          </div>
        </SettingsItem>
        {/* <SettingsItem title="API Secret Key" description="(可选)" icon={Route}>
          <div className="flex flex-col justify-center items-center w-[300px]">
            <Input
              className="w-[100%]"
              type="text"
              placeholder=""
              value={config.model.secret_key}
              disabled={true}
              onChange={(e) => {
                console.log("settings changed:", { path: e.target.value });
                setConfig({
                  ...config,
                  model: {
                    ...config.model,
                    secret_key: e.target.value,
                  },
                });
              }}
            />
          </div>
        </SettingsItem> */}
        <SettingsItem title="UserAgent" icon={Compass}>
          <div className="flex flex-col justify-center items-center w-[300px]">
            <Input
              className="w-[100%]"
              type="text"
              placeholder="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36"
              defaultValue={config.model.user_agent}
              onContextMenu={(e)=>{
                e.stopPropagation();
              }}
              onChange={(e) => {
                console.log("settings changed:", {
                  user_agent: e.target.value,
                });
                setConfig({
                  ...config,
                  model: {
                    ...config.model,
                    user_agent: e.target.value,
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
