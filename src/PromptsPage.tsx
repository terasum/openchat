import React from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  ScrollArea,
  BoxIcon,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui";

import "./PromptsPage.scss";

interface PromptCard {
  title: string;
  description: string;
  icon: string;
  bgColor: string;
}

const contacts: PromptCard[] = [
  {
    title: "AI 搜索",
    description: "实时资讯，丰富信源，整合搜索",
    icon: "search-alt-2",
    bgColor: "bg-blue-100",
  },
  {
    title: "网页摘要",
    description: "任意链接，大纲总结，金句摘录",
    icon: "window",
    bgColor: "bg-gray-100",
  },
  {
    title: "帮我写作",
    description: "多种体裁，润色校对，一键成文",
    icon: "pen",
    bgColor: "bg-green-100",
  },
  {
    title: "阅读总结",
    description: "论文课件，财报合同，翻译总结",
    icon: "book-reader",
    bgColor: "bg-red-100",
  },
  {
    title: "解题答疑",
    description: "传图识题，校考职考，精准解析",
    icon: "question-mark",
    bgColor: "bg-pink-100",
  },
  {
    title: "翻译",
    description: "短句长文，多种语言，准确翻译",
    icon: "book-alt",
    bgColor: "bg-indigo-100",
  },
];

const Prompts: React.FC = () => {
  return (
    <div className=" w-full h-full">
      <Tabs defaultValue="all" className="w-full h-full p-6">
        <TabsList className="h-[30px] bg-blue">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="english">English</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="w-full h-[calc(100%-50px)]">
          <ScrollArea className="prompts-wrapper h-full w-full">
            {contacts.map((contact, index) => (

<Card key={index}>
<CardHeader>
  <CardTitle>                <div className="text-3xl mr-4"><BoxIcon iconName={contact.icon} size={24} color="#000" className="mr-4"></BoxIcon> </div>
  {contact.title}
  </CardTitle>
  <CardDescription>{contact.description}</CardDescription>
</CardHeader>
</Card>

            //   <div
            //     key={index}
            //     className={`prompts-card flex flex-row gap-4 p-4 mt-2 rounded-lg shadow-sm ${contact.bgColor}`}
            //   >
            //     <div>
            //       <h3 className="font-semibold"></h3>
            //       <p className="text-sm text-gray-600"></p>
            //     </div>
            //   </div>
            ))}
          </ScrollArea>
        </TabsContent>
        <TabsContent value="english">english category</TabsContent>
      </Tabs>
    </div>
  );
};

export default Prompts;
