import { HTTPMessageBusClient } from "ts-rmb-http-client";

export default async function getGrid(){
    const grid = new window.grid3_client.GridClient(
        window.grid3_client.NetworkEnv.qa,
        "crouch kangaroo bubble riot fetch spoil chest wisdom inquiry dry toe hawk",
        "maya",
        new HTTPMessageBusClient(0, "", "", ""),
        undefined,
        window.grid3_client.BackendStorageType.tfkvstore
      );
    
      try {
        await grid.connect();
      } catch {}

      return grid;
    }