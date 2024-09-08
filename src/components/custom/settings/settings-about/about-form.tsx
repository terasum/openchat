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
  Copyright
} from "lucide-react";
import { SettingsItem } from "../components/settings-item";

export function AboutForm() {
  return (
    <Card className="rounded-none border-none shadow-none">
      <CardHeader>
        <CardTitle className="text-lg">帮助关于</CardTitle>
        <CardDescription>Help&About</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">

      <SettingsItem
          title="OpenChat"
          icon={AppWindow}
        >
         <Badge className="mr-2">v0.1.28</Badge>
        </SettingsItem>

        <SettingsItem
          title="帮助文档"
          icon={HelpCircle}
        >
          <Button variant={"ghost"}>
            <ArrowUpRightSquareIcon size={18} color="#666" />
          </Button>
        </SettingsItem>

        <SettingsItem
          title="隐私政策"
          icon={Shield}
        >
          <Button variant={"ghost"}>
            <ArrowUpRightSquareIcon size={18} color="#666" />
          </Button>
        </SettingsItem>

        <SettingsItem
          title="终端用户协议"
          icon={ScrollText}
        >
          <Button variant={"ghost"}>
            <ArrowUpRightSquareIcon size={18} color="#666" />
          </Button>
        </SettingsItem>

        <SettingsItem
          title="开源协议"
          icon={Copyright}
        >
           <Button variant={"ghost"}>
            <ArrowUpRightSquareIcon size={18} color="#666" />
          </Button>
        </SettingsItem>
      </CardContent>
      <CardFooter>
        {/* <Button>保存设置</Button> */}
      </CardFooter>
    </Card>
  );
}
