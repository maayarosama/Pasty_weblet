<svelte:options tag="tf-tabs" />

<script lang="ts">
  import type { ITab } from "../types";
  import { createEventDispatcher, onMount } from "svelte";

  const dispatch =
    createEventDispatcher<{ removed: number; select: string; init: void }>();

  export let tabs: ITab[];
  export let active: string;
  export let disabled: boolean = false;
  export let selectedTab: string = null;
  export let selectedID: number = null;


  function onSelectTab(tab: string) {
    if (active !== tab) {
      active = tab;
      dispatch("select", tab);
    }
  }

  onMount(() => {
    dispatch("init");
  });
</script>

<div class={"tabs is-centered"}>
  <ul style={disabled ? "pointer-events: none; cursor: default;" : ""}>
    {#if tabs}
      {#each tabs as tab, index (tab.label)}
        <li class={active === tab.value ? "is-active" : ""}>
          <a
            href="#!"
            on:click|preventDefault={onSelectTab.bind(undefined, tab.value)}
          >
            <span>{tab.label}</span>
           
          </a>
        </li>
      {/each}
    {/if}
  </ul>
</div>

<style lang="scss" scoped>
  @import url("https://cdn.jsdelivr.net/npm/bulma@0.9.3/css/bulma.min.css");
</style>
