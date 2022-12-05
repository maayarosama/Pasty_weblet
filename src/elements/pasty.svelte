<svelte:options tag="tf-pasty" />

<script lang="ts">
  import Pasty, { Disk, Env } from "../types/pasty";
  import type { IFormField, ITab } from "../types";
  import deployPasty from "../utils/DeployPasty";

  // Components
  import Input from "../components/Input.svelte";
  import Tabs from "../components/Tabs.svelte";
  import SelectNodeId from "../components/SelectNodeId.svelte";
  import DeployBtn from "../components/DeployBtn.svelte";
  import Alert from "../components/Alert.svelte";
  import AddBtn from "../components/AddBtn.svelte";
  import DeleteBtn from "../components/DeleteBtn.svelte";

  const tabs: ITab[] = [
    { label: "Config", value: "config" },
    { label: "Environment Variables", value: "env" },
    { label: "Disks", value: "disks" },
  ];
  // prettier-ignore
  let data = new Pasty();

  // prettier-ignore
  let baseFields: IFormField[] = [
    { label: "CPU (vCores)", symbol: 'cpu', placeholder: 'CPU vCores', type: 'number',invalid: false},
    { label: "Memory (MB)", symbol: 'memory', placeholder: 'Your Memory in MB', type: 'number', invalid: false },
    { label: "Public IPv4", symbol: "publicIp", placeholder: "", type: 'checkbox' },
    { label: "Public IPv6", symbol: "publicIp6", placeholder: "", type: 'checkbox' },
    { label: "Planetary Network", symbol: "planetary", placeholder: "", type: 'checkbox' },
  ];

  const nameField: IFormField = { label: "Name", placeholder: "Virtual Machine Name", symbol: "name", type: "text",  invalid: false }; // prettier-ignore

  // prettier-ignore
  const envFields: IFormField[] = [
    { label: 'Key', symbol: 'key', placeholder: "Environment Key", type: "text", invalid:false},
    { label: 'Value', symbol: 'value', placeholder: "Environment Value", type: "text" },
  ];

  let active: string = "config";
  let loading = false;
  let success = false;
  let failed = false;
  let message: string;
  let deployedpasty: Object;
  let status: "valid" | "invalid";
  // $: disabled = ((loading || !data.valid) && !(success || failed))  || status !== "valid" || nameField.invalid || !(data.planetary || data.publicIp || data.publicIp6); // prettier-ignore

  async function onDeployPasty() {
    loading = true;

    deployPasty(data, "vm")
      .then((res) => {
        deployedpasty = res;
        success = true;
      })
      .catch((err: Error) => {
        failed = true;
        message = typeof err === "string" ? err : err.message;
      })
      .finally(() => {
        loading = false;
      });
  }
</script>

<div style="padding: 15px;">
  <form on:submit|preventDefault={onDeployPasty} class="box">

    {#if loading}
      <Alert type="info" message={"Loading..."} />
    {:else if success}
      <Alert
        type="success"
        message="Successfully deployed VM."
        deployed={true}
      />
    {:else if failed}
      <Alert type="danger" message={message || "Failed to deploy VM."} />
    {:else}
      <Tabs bind:active {tabs} />

      {#if active === "config"}
        <Input
          bind:data={data.name}
          bind:invalid={nameField.invalid}
          field={nameField}
        />

        {#each baseFields as field (field.symbol)}
          {#if field.invalid !== undefined}
            <Input
              bind:data={data[field.symbol]}
              bind:invalid={field.invalid}
              {field}
            />
          {:else}
            <Input bind:data={data[field.symbol]} {field} />
          {/if}
        {/each}

        <SelectNodeId
          publicIp={data.publicIp}
          cpu={data.cpu}
          memory={data.memory}
          ssd={data.disks.reduce(
            (total, disk) => total + disk.size,
            data.rootFs
          )}
          bind:nodeSelection={data.selection.type}
          bind:data={data.nodeId}
          filters={data.selection.filters}
          on:fetch={({ detail }) => (data.selection.nodes = detail)}
          nodes={data.selection.nodes}
        />
      {:else if active === "env"}
        <AddBtn on:click={() => (data.envs = [...data.envs, new Env()])} />
        <div class="nodes-container">
          {#each data.envs as env, index (env.id)}
            <div class="box">
              <DeleteBtn
                name={env.key}
                on:click={() =>
                  (data.envs = data.envs.filter((_, i) => index !== i))}
              />
              {#each envFields as field (field.symbol)}
                <Input bind:data={env[field.symbol]} {field} />
              {/each}
            </div>
          {/each}
        </div>
      {:else if active === "disks"}
        <AddBtn on:click={() => (data.disks = [...data.disks, new Disk()])} />
        <div class="nodes-container">
          {#each data.disks as disk, index (disk.id)}
            <div class="box">
              <DeleteBtn
                name={disk.name}
                on:click={() =>
                  (data.disks = data.disks.filter((_, i) => index !== i))}
              />
              {#each disk.diskFields as field (field.symbol)}
                {#if field.symbol === "mountpoint"}
                  <Input
                    bind:data={disk[field.symbol]}
                    field={{
                      ...field,
                    }}
                  />
                {:else if field.symbol === "name"}
                  <Input
                    bind:data={disk[field.symbol]}
                    field={{
                      ...field,
                    }}
                  />
                {:else}
                  <Input
                    bind:data={disk[field.symbol]}
                    {field}
                    bind:invalid={field.invalid}
                  />
                {/if}
              {/each}
            </div>
          {/each}
        </div>
      {/if}
    {/if}

    <DeployBtn
      disabled={false}
      {loading}
      {failed}
      {success}
      on:click={(e) => {
        if (success || failed) {
          e.preventDefault();
          success = false;
          failed = false;
          loading = false;
        }
      }}
    />
  </form>
</div>

{#if success}
  <div>
    {JSON.stringify(deployedpasty)}
  </div>
{/if}

<style lang="scss" scoped>
  @import url("https://cdn.jsdelivr.net/npm/bulma@0.9.3/css/bulma.min.css");
  @import "../assets/global.scss";
</style>
