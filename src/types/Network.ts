import { v4 } from "uuid";

export class Network {
    constructor(
      public name: string = "NW" + v4().split("-")[0],
      public ipRange: string = "10.20.0.0/16"
    ) { }
  
    public get valid(): boolean {
      const { name, ipRange } = this;
      return name !== "" &&
        ipRange !== "" 
       
    }
  }