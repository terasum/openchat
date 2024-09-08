import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
  Switch,
  Label,
  Button,
  Card,
  CardHeader,
  CardDescription,
  CardContent,
  CardFooter,
  CardTitle,
  Input,
  Slider,
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui";
import { cn } from "@/lib/utils";
import {
  HelpCircle,
  AppWindow,
  Shield,
  ScrollText,
  Copyright,
} from "lucide-react";
import { useState } from "react";

import { SettingsItem } from "../components/settings-item";

export function DisplayForm() {
  const [sliderValue, setSliderValue] = useState([50]);

  return (
    <Card className="rounded-none border-none shadow-none h-full overflow-y-auto">
      <CardHeader>
        <CardTitle className="text-lg">模型设置</CardTitle>
        <CardDescription>Models</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <SettingsItem title="OpenChat" icon={AppWindow}>
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select a fruit" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Fruits</SelectLabel>
                <SelectItem value="apple">Apple</SelectItem>
                <SelectItem value="banana">Banana</SelectItem>
                <SelectItem value="blueberry">Blueberry</SelectItem>
                <SelectItem value="grapes">Grapes</SelectItem>
                <SelectItem value="pineapple">Pineapple</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </SettingsItem>

        <SettingsItem title="帮助文档" icon={HelpCircle}>
          <Label htmlFor="airplane-mode">Airplane Mode</Label>
          <Switch id="airplane-mode" />
        </SettingsItem>

        <SettingsItem title="隐私政策" icon={Shield}>
          <div className="flex flex-col justify-center items-center w-[200px]">
            <Input type="email" placeholder="Email" />
          </div>
        </SettingsItem>

        <SettingsItem title="终端用户协议" icon={ScrollText}>
          <div className="flex flex-row justify-center items-center w-[200px]">
            <Label htmlFor="slider-input">{sliderValue[0]}</Label>

            <Slider
              id="slider-input"
              defaultValue={sliderValue}
              max={100}
              step={1}
              className={cn("w-[100%]")}
              onValueChange={(value) => setSliderValue(value)}
            />
          </div>
        </SettingsItem>

        <SettingsItem title="开源协议" icon={Copyright}>
          <RadioGroup defaultValue="comfortable" className="flex flex-row">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="default" id="r1" />
              <Label htmlFor="r1">Default</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="comfortable" id="r2" />
              <Label htmlFor="r2">Comfortable</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="compact" id="r3" />
              <Label htmlFor="r3">Compact</Label>
            </div>
          </RadioGroup>
        </SettingsItem>
      </CardContent>
      <CardFooter>{/* <Button>保存设置</Button> */}</CardFooter>
    </Card>
  );
}
