import React, { type SetStateAction } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { Toaster } from "@/components/ui/toaster";

import { Provider } from "jotai/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useHydrateAtoms } from "jotai/react/utils";
import { queryClientAtom } from "jotai-tanstack-query";

function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: Infinity,
      },
    },
  });
}
const newQueryClient = createQueryClient();

const HydrateAtoms = ({ children }: any) => {
  useHydrateAtoms([
    [queryClientAtom, newQueryClient as SetStateAction<QueryClient>],
  ]);
  return children;
};

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={newQueryClient}>
      <Provider>
        <HydrateAtoms>
          <App />
          <Toaster />
        </HydrateAtoms>
      </Provider>
    </QueryClientProvider>
  </React.StrictMode>
);
