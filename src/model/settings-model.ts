export interface SettingsRaw {
  id: number;
  key: string;
  value: string;
  createdAt: string;
  updatedAt: string;
}

export interface SettingsModel {
  model: {
    temperature: number[];
    max_token_length: number[];
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
    useragent: string;
  };
}

export const defaultSettings: SettingsModel = {
  model: {
    temperature: [0.7],
    max_token_length: [1200],
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
    useragent:
      "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1",
  },
};
