import { wrapGetSettings, wrapSetSettings } from "@/rust-bindings";

export async function getActivePrompt(key: string) {
  const config = await wrapGetSettings(key);
  if (config) {
    return config.value;
  }
  return "";
}

export async function setActivePrompt(key: string, value: string) {
  try {
    await wrapSetSettings(key, value);
    return true;
  } catch (e: any) {
    return false;
  }
}
