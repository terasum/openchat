import {
  Card,
  CardHeader,
  CardDescription,
  CardContent,
  CardFooter,
  CardTitle,
  Input,
} from "@/components/ui";

import { Globe, Key, Route, Compass } from "lucide-react";

import { SettingsItem } from "../components/settings-item";
import { useAppSettings } from "@/hooks/use-app-config";

export function AccountSettings() {
  const { config, setConfig } = useAppSettings();

  return (
    <Card className="rounded-none border-none shadow-none">
      <CardHeader>
        <CardTitle className="text-lg">API信息</CardTitle>
        <CardDescription>API Information</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        
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
        <SettingsItem title="UserAgent" icon={Compass}>
          <div className="flex flex-col justify-center items-center w-[300px]">
            <Input
              className="w-[100%]"
              type="text"
              placeholder="Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1"
              value={config.apikey.user_agent}
              onChange={(e) => {
                console.log("settings changed:", { user_agent: e.target.value });
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
        </SettingsItem>
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
