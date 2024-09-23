import { Settings as S } from "@/rust-bindings";
export interface Settings extends S {}

export interface SettingsRaw {
  id: number;
  key: string;
  value: string;
  created_at: string;
  updated_at: string;
}

export interface AppConfig {
  model: {
    model_provider: string;
    model_name: string;
    api_url: string;
    api_key: string;
    secret_key: string;
    model_opts: any;
    user_agent: string;
  };

  appearance: {
    language: string;
    theme: string;
  };
}

export const defaultSettings: AppConfig = {
  model: {
    model_provider: "openchat",
    model_name: "gpt-4o-mini",
    api_url: "https://proxy.openchat.dev/v1/chat/completions",
    api_key: "SK-<your-api-key>",
    secret_key: "",
    model_opts: {},
    user_agent:
      "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1",
  },
  appearance: {
    language: "zh_CN",
    theme: "light",
  },
};
