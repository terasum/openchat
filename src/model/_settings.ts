import { Settings as S } from "@/rust-bindings";
export interface Settings extends S {}

export interface SettingsRaw {
  id: number;
  key: string;
  value: string;
  created_at: string;
  updated_at: string;
}

export interface SettingsModel {
  model: {
    default_model: string;
    enable_memory: boolean;
  };

  appearance: {
    language: string;
    theme: string;
  };

  apikey: {
    domain: string;
    apikey: string;
    path: string;
    user_agent: string;
  };
}

export const defaultSettings: SettingsModel = {
  model: {
    default_model: "gpt-4o-mini",
    enable_memory: false,
  },
  appearance: {
    language: "zh_CN",
    theme: "light",
  },
  apikey: {
    domain: "https://proxy.openchat.dev",
    path: "/v1/chat/completions",
    apikey: "SK-<your-api-key>",
    user_agent:
      "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1",
  },
};
