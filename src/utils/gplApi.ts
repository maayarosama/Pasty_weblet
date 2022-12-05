export default function gqlApi<T>(
  query: string,
  variables: Object = {}
): Promise<T> {
  const grid = new window.grid3_client.GridClient(
    "" as any,
    "",
    "",
    null
  );

  const { graphql } = grid.getDefaultUrls(window.grid3_client.NetworkEnv.qa);

  return fetch(graphql, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, variables }),
  })
    .then((res) => res.json())
    .then<T>(({ data }) => data);
}
