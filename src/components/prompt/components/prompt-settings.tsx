import {
  Label,
  Switch,
  Slider,
  Badge,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";
import { useAppDispatch, useAppSelector } from "@/store";
import { Prompt } from "@/rust-bindings";
import { updateSelectPrompt } from "@/store/prompts";
import { useState } from "react";
export function PromptSettings() {
  const selectedPrompt = useAppSelector(
    (state) => state.prompts.selectedPrompt
  );
  const activatedPrompt = useAppSelector(
    (state) => state.prompts.activatedPrompt
  );
  const dispatch = useAppDispatch();

  function updatePrompt(prompt: Prompt) {
    dispatch(updateSelectPrompt(prompt));
  }

  const [provider, _] = useState("openchat");

  return (
    <div className="gap-2 p-2 pt-0 pr-6 pl-6 w-[100%] overflow-y-auto h-[100%] grid grid-cols-2">
      <div className="flex flex-col">
        <div className="mb-4 w-full">
          <Label
            htmlFor="model_provider"
            className="flex flex-row items-center text-xs font-normal text-gray-500 justify-between w-full"
          >
            <span>模型提供商</span>
            <Select value={provider}>
              <SelectTrigger className="w-[60%] text-xs mt-2">
                <SelectValue placeholder="Select a model" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="openchat">OpenChat</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </Label>
        </div>
      </div>
      <div className="flex flex-col">
        <div className="mb-4 w-full">
          <Label
            htmlFor="with_context"
            className="flex flex-row items-center text-xs font-normal text-gray-500 justify-between w-full"
          >
            上下文记忆
            <Switch
              id="with_context"
              checked={selectedPrompt.with_context}
              onCheckedChange={(e) => {
                updatePrompt({
                  ...selectedPrompt,
                  with_context: e,
                });
              }}
            />
          </Label>
        </div>
        <div className="mb-4 w-full gap-2 grid grid-rows-2">
          <Label
            htmlFor="with_context_size"
            className="flex text-xs font-normal text-gray-500 justify-between"
          >
            <span>携带上下文数量</span>{" "}
            <span>{selectedPrompt.with_context_size}</span>
          </Label>
          <Slider
            id="with_context_size"
            min={0}
            max={128}
            step={1}
            value={[selectedPrompt.with_context_size]}
            onValueChange={(e) => {
              updatePrompt({
                ...selectedPrompt,
                with_context_size: e[0],
              });
            }}
          />
        </div>
        <div className="mb-4 w-full gap-2 grid grid-rows-2">
          <Label
            htmlFor="with_context_size"
            className="flex text-xs font-normal text-gray-500 justify-between"
          >
            <span>最大Token数</span> <span>{selectedPrompt.max_tokens}</span>
          </Label>
          <Slider
            id="max_tokens"
            min={100}
            max={2500}
            step={10}
            value={[selectedPrompt.max_tokens]}
            onValueChange={(e) => {
              updatePrompt({
                ...selectedPrompt,
                max_tokens: e[0],
              });
            }}
          />
        </div>
        <div className="mb-4 w-full gap-2 grid grid-rows-2">
          <Label
            htmlFor="temperature"
            className="flex text-xs font-normal text-gray-500 justify-between"
          >
            <span>Temperature</span> <span>{selectedPrompt.temperature}</span>
          </Label>
          <Slider
            id="temperature"
            min={0.1}
            max={2}
            step={0.1}
            value={[Number(selectedPrompt.temperature)]}
            onValueChange={(e) => {
              updatePrompt({
                ...selectedPrompt,
                temperature: String(e[0]),
              });
            }}
          />{" "}
        </div>

        <div className="mb-0 w-full gap-2 grid grid-rows-2">
          <Label
            htmlFor="top_p"
            className="flex text-xs font-normal text-gray-500 justify-between"
          >
            <span>Top P</span> <span>{selectedPrompt.top_p}</span>
          </Label>
          <Slider
            id="top_p"
            min={0.1}
            max={1}
            step={0.1}
            value={[Number(selectedPrompt.top_p)]}
            onValueChange={(e) => {
              updatePrompt({
                ...selectedPrompt,
                top_p: String(e[0]),
              });
            }}
          />
        </div>

        <div className="flex items-center gap-2 mt-3">
          {selectedPrompt.labels?.length ? (
            <div className="flex items-center gap-2">
              {activatedPrompt.id == selectedPrompt.id ? (
                <Badge variant={"default"}>{"active"}</Badge>
              ) : (
                <Badge variant={"outline"}>{"unused"}</Badge>
              )}

              {selectedPrompt.labels?.split(",").map((label) => (
                <Badge key={label} variant={"outline"}>
                  {label}
                </Badge>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
