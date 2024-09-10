import { useAtom, atom } from "jotai";
import { atomWithImmer } from "jotai-immer";
import { loadable, createJSONStorage } from "jotai/utils";

import {
  SettingsRaw,
  SettingsModel,
  defaultSettings,
} from "@/model/settings-model";

import {
  wrapGetAppConfig,
  wrapUpdateAppConfig,
  Settings,
} from "@/rust-bindings";

async function initAppSettings() {
  const data = await wrapGetAppConfig();
  console.log("initAppSettings", data);
  return data
    ? (JSON.parse((data as SettingsRaw).value) as SettingsModel)
    : defaultSettings;
}

async function updateAppSettings(settings: SettingsModel) {
  console.log("prepare to update the config", settings);
  const data = await wrapUpdateAppConfig({
    id: 1,
    key: "app_settings",
    value: JSON.stringify(settings),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  } as Settings);
  console.log("updateAppSettings finished", data);
  return data;
}

const atomWithDBAsyncStorage = (initialValue: SettingsModel) => {
  const baseAtom = atom(initialValue);

  baseAtom.onMount = (setValue) => {
    (async () => {
      const data = await initAppSettings();
      setValue(data);
    })();
  };

  const derivedAtom = atom(
    (get) => get(baseAtom),
    (get, set, update) => {
      const nextValue =
        typeof update === "function" ? update(get(baseAtom)) : update;
      set(baseAtom, nextValue);
      updateAppSettings(nextValue);
    }
  );
  return derivedAtom;
};

const appConfig = atomWithDBAsyncStorage(defaultSettings);
export function useAppSettings() {
  const [getter, setter] = useAtom<SettingsModel>(appConfig);
  const appSettingProxy = () => {
    return {
      apikey: {
        get apikey() {
          return getter.apikey.apikey;
        },
        set apikey(apikey: string) {
          setter((state) => {
            return {
              ...state,
              apikey: {
                ...state.apikey,
                apikey,
              },
            };
          });
        },
        get domain() {
          return getter.apikey.domain;
        },
        set domain(domain: string) {
          setter((state) => {
            return {
              ...state,
              apikey: {
                ...state.apikey,
                domain,
              },
            };
          });
        },
        get path() {
          return getter.apikey.path;
        },
        set path(path: string) {
          setter((state) => {
            return {
              ...state,
              apikey: {
                ...state.apikey,
                path,
              },
            };
          });
        },
        get useragent() {
          return getter.apikey.useragent;
        },
        set useragent(useragent: string) {
          setter((state) => {
            return {
              ...state,
              apikey: {
                ...state.apikey,
                useragent: useragent,
              },
            };
          });
        },
      },
      model: {
        get temperature() {
          return getter.model.temperature;
        },
        set temperature(temperature: number[]) {
          setter((state) => {
            return {
              ...state,
              model: {
                ...state.model,
                temperature,
              },
            };
          });
        },
        get max_token_length() {
          return getter.model.max_token_length;
        },
        set max_token_length(max_token_length: number[]) {
          setter((state) => {
            return {
              ...state,
              model: {
                ...state.model,
                max_token_length,
              },
            };
          });
        },
        get default_model() {
          return getter.model.default_model;
        },

        set default_model(default_model: string) {
          setter((state) => {
            return {
              ...state,
              model: {
                ...state.model,
                default_model,
              },
            };
          });
        },
        get enable_memory() {
          return getter.model.enable_memory;
        },
        set enable_memory(enable_memory: boolean) {
          setter((state) => {
            return {
              ...state,
              model: {
                ...state.model,
                enable_memory,
              },
            };
          });
        },
      },
      appearance: {
        get language() {
          return getter.appearance.language;
        },
        set language(language: string) {
          setter((state) => {
            return {
              ...state,
              appearance: {
                ...state.appearance,
                language,
              },
            };
          });
        },
        get theme() {
          return getter.appearance.theme;
        },
        set theme(theme: string) {
          setter((state) => {
            return {
              ...state,
              appearance: {
                ...state.appearance,
                theme,
              },
            };
          });
        },
      },
    };
  };

  return appSettingProxy();
}
