import { Prompt } from "@/components/custom/prompt/Prompt";
import { prompts } from "@/hooks/prompts-data";

export default function PromptPage() {
  return (
    <>
      <div className="hidden flex-col md:flex">
        <Prompt prompt={prompts} />
      </div>
    </>
  );
}
