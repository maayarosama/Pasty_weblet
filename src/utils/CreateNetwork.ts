import type { Network } from "../types/Network";

export default function createNetwork(nw: Network, access: boolean = false) {
  const network = new window.grid3_client.NetworkModel();
  network.name = nw.name;
  network.ip_range = nw.ipRange;
  network.addAccess = access;
  return network;
}
