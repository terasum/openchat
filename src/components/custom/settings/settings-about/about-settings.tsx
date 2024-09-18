import {
  Button,
  Card,
  CardHeader,
  CardDescription,
  CardContent,
  CardFooter,
  CardTitle,
  Badge,
} from "@/components/ui";

import {
  HelpCircle,
  AppWindow,
  ArrowUpRightSquareIcon,
  Shield,
  ScrollText,
  Copyright,
} from "lucide-react";
import { SettingsItem } from "../components/settings-item";

import { version } from "@/version.json";

import { invoke } from "@tauri-apps/api/tauri";

const openBrowser = async (url: string) => {
  await invoke("open_url", { url });
};

export function AboutSettings() {
  return (
    <Card className="rounded-none border-none shadow-none">
      <CardHeader>
        <CardTitle className="text-lg">帮助关于</CardTitle>
        <CardDescription>About</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <SettingsItem title="OpenChat" icon={AppWindow}>
          <Badge
            onClick={() => {
              openBrowser("https://www.openchat.dev");
            }}
            className="mr-2"
          >
           {version}
          </Badge>
        </SettingsItem>

        <SettingsItem title="帮助文档" icon={HelpCircle}>
          <Button
            variant={"ghost"}
            onClick={() => {
              openBrowser("https://www.openchat.dev/docs");
            }}
          >
            <ArrowUpRightSquareIcon size={18} color="#999" />
          </Button>
        </SettingsItem>

        <SettingsItem title="隐私政策" icon={Shield}>
          <Button
            variant={"ghost"}
            onClick={() => {
              openBrowser("https://www.openchat.dev/docs/privacy");
            }}
          >
           <ArrowUpRightSquareIcon size={18} color="#999" />
          </Button>
        </SettingsItem>

        <SettingsItem title="终端用户协议" icon={ScrollText}>
          <Button
            variant={"ghost"}
            onClick={() => {
              openBrowser("https://www.openchat.dev/docs/terms");
            }}
          >
          <ArrowUpRightSquareIcon size={18} color="#999" />
          </Button>
        </SettingsItem>

        <SettingsItem title="开源协议" icon={Copyright}>
          <Button
            variant={"ghost"}
            onClick={() => {
              openBrowser("https://www.openchat.dev/docs/opensource");
            }}
          >
            <ArrowUpRightSquareIcon size={18} color="#999" />
          </Button>
        </SettingsItem>
      </CardContent>
      <CardFooter>{/* <Button>保存设置</Button> */}</CardFooter>
    </Card>
  );
}
