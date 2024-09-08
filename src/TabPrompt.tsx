import { Prompt } from "@/components/custom/prompt/Prompt";
import { prompts } from "@/hooks/prompts-data";

export default function MailPage() {
  //   const layout = cookies().get("react-resizable-panels:layout:mail")
  //   const collapsed = cookies().get("react-resizable-panels:collapsed")

  const defaultLayout = undefined;

  return (
    <>
      <div className="hidden flex-col md:flex">
        <Prompt
          prompt={prompts}
          defaultLayout={defaultLayout}
        />
      </div>
    </>
  );
}
