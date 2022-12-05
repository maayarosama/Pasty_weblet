
export async function fetchCountries() : Promise<any> {
    const grid = new window.grid3_client.GridClient(
      "" as any,
      "",
      "",
      null
    );
  
    const { rmbProxy } = grid.getDefaultUrls( window.grid3_client.NetworkEnv.qa );
    let data : any;
  
    return fetch(`${rmbProxy}/stats?status=up`, {
      method: "GET",
    })
      .then(data = response => response.json())
      .then(response => response["nodesDistribution"])
      .catch((err) => {console.log(err) ; return err});
  }
