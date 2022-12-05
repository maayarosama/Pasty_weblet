/// <reference types="svelte" />
/// <reference types="vite/client" />
import type * as grid3_client from "grid3_client/dist/node";
import currentDeploymentStore from "./stores/currentDeployment";

declare global {
  interface Window {
    currentDeploymentStore: typeof currentDeploymentStore;
    grid3_client: GridClient;
  }
}