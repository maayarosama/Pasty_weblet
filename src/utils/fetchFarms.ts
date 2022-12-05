import type { FilterOptions } from "grid3_client";
import gqlApi from "./gplApi";
import { getBlockedFarmsIDs } from "./findNodes";
import paginatedFetcher from "./paginatedFetcher";

const queryCount = `
query GetLimits {
    farms: farmsConnection(orderBy: farmID_ASC) { farms_limit: totalCount }
}
`;

const queryCountIPFilter = `
query GetLimits {
  farms: farmsConnection(where: {publicIPs_some: {}}, orderBy: farmID_ASC) { farms_limit: totalCount }
}
`;

interface IQueryCount {
  farms: { farms_limit: number };
}

const queryData = `
query GetData($farms_limit: Int!) {
    farms(limit: $farms_limit) { name farmID }
}
`;

const queryDataIPFilter = `
query GetData($farms_limit: Int!) {
  farms(limit: $farms_limit, where: {publicIPs_some: {}}) {
    name
    farmID
  }
}
`;

interface IQueryData {
  farms: Array<{ name: string }>;
}

export default function fetchFarms(
  filters: FilterOptions,
  exclusiveFor: string
) {
  var query = queryCount;
  var queryDataSelect = queryData;
  if (filters.publicIPs) {
    query = queryCountIPFilter;
    queryDataSelect = queryDataIPFilter;
  }

  return gqlApi<IQueryCount>( query)
    .then(({ farms: { farms_limit } }) => {
      return { farms_limit };
    })
    .then(async (vars) => {
      let { farms } = await gqlApi<IQueryData>( queryDataSelect, vars);

      farms = await getOnlineFarms(
        farms,
        exclusiveFor,
        filters.publicIPs
      );

      return { farms };
    });
}

export async function getOnlineFarms( farms, exclusiveFor, publicIp) {
  const grid = new window.grid3_client.GridClient(
    "" as any,
    "",
    "",
    null
  );

  const { graphql, rmbProxy } = grid.getDefaultUrls(window.grid3_client.NetworkEnv.qa);

  let blockedFarms = [];
  let onlineFarmsSet = new Set();
  let onlineFarmsArr = [];

//   if (exclusiveFor && !publicIp) {
//     // no need for exclusive for if we have an ip

//     blockedFarms = await getBlockedFarmsIDs(
//       exclusiveFor,
//       rmbProxy,
//       graphql
//     );
//   }

  const upNodes = await paginatedFetcher(
    `${rmbProxy}/nodes?&status=up`,
    0,
    50
  );

  for (let node of upNodes) {
    if (!blockedFarms.includes(node.farmId)) {
      onlineFarmsSet.add(node.farmId);
    }
  }

  onlineFarmsArr = Array.from(onlineFarmsSet);

  const onlineFarms = farms.filter((farm) =>
    onlineFarmsArr.includes(farm.farmID)
  );

  return onlineFarms;
}
