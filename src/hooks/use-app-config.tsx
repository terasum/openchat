// import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
// import { getAppConfig, updateAppConfig } from "@/api/settings";
import { useState, useEffect } from "react";
import { Logger } from "@/lib/log";
import { debounce } from "@/lib/utils";

const logger = new Logger("use-app-config.tsx");

import {SettingsModel, defaultSettings } from "@/model";

// const useConfigMutation = () => {
//   const queryClient = useQueryClient();

//   const query = useQuery(
//     {
//       queryKey: [KEY_APP_CONFIG],
//       queryFn: async () => {
//         logger.log("setting query", "start");
//         const settings = await getAppConfig();
//         logger.log("setting query", { settings: JSON.parse(settings.value) });
//         return settings;
//       },
//     },
//     queryClient
//   );

//   const mutation = useMutation(
//     {
//       mutationFn: async (appSettings: Settings) => {
//         await updateAppConfig(appSettings);
//       },
//       mutationKey: [KEY_APP_CONFIG_UPDATE],
//       onSuccess: () => {
//         void queryClient.invalidateQueries({ queryKey: [KEY_APP_CONFIG] });
//       },
//       onError: (e: any) => {
//         logger.error("useActiveSettingMutation", "mutationFn trigger error", {
//           error: e,
//         });
//       },
//     },
//     queryClient
//   );
//   return { query, mutation };
// };

export function useAppSettings() {
  // const { query, mutation } = useConfigMutation();
  const query = {
    data: {
      value: JSON.stringify(defaultSettings),
    },
    isLoading: false,
  };

  const [config, setConfig] = useState<SettingsModel>(defaultSettings);

  useEffect(() => {
    logger.log("useEffect[query]", "query.data.trigger", { data: query.data });
    if (!query.data) return;
    const rawConfig = JSON.parse(query.data.value);
    logger.log("useEffect[query]", "query.data.trigger", rawConfig);
    setConfig(rawConfig as SettingsModel);
  }, [query.isLoading]);

  const updateConfig = debounce(async (config: SettingsModel) => {
    logger.log("updateConfig debounced", { config });
    // await mutation.mutateAsync({
    //   id: 1,
    //   key: KEY_APP_CONFIG,
    //   value: JSON.stringify(config),
    //   created_at: new Date().toISOString(),
    //   updated_at: new Date().toISOString(),
    // });
  }, 1000);

  useEffect(() => {
    logger.log("useEffect[config]", "trigger", { config });
    updateConfig(config);
  }, [config]);

  return { config, setConfig };
}
