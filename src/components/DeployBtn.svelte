<svelte:options tag="tf-deploy-btn" />

<script lang="ts">

  export let loading: boolean;
  export let success: boolean;
  export let failed: boolean;
  export let disabled: boolean;
  export let label: string = "Deploy";
</script>

<div class="is-flex is-justify-content-space-between is-align-items-center">
  <div style="width: 100%; padding-right: 15px;">
    {#if loading}
      <div class="notification is-warning is-light">
        <strong>Warning!</strong> Make sure to not leave the page if there is an
        in-progress deployment or deletion.
      </div>
   
    {/if}
  </div>
  <button
    class={"button " + (loading ? "is-loading" : "")}
    style={`background-color: #1982b1; color: white`}
    type="submit"
    on:click
    disabled={disabled}
  >
    {#if success || failed}
      Back
    {:else}
      {label}
    {/if}
  </button>
</div>
