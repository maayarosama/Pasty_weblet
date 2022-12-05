<svelte:options tag="tf-inputt" />

<script lang="ts">
  import { createEventDispatcher, onMount } from "svelte";
  import type { IFormField } from "../types";
  import { v4 } from "uuid";

  const dispatch = createEventDispatcher<{ input: Event }>();
  export let field: IFormField;
  export let data: any;
  export let selected: number = 0;
  export let invalid = false;

  $: numericData = data?.toString();

  const id = v4();


  function _onSelectChange(e: Event) {
    dispatch("input", e);
    const select = e.target as HTMLSelectElement;
    selected = select.selectedIndex;
  }

  function _onInput(e: Event) {
    const target = e.target as HTMLInputElement;
    const isNum = target.getAttribute("data-type") === "number";

    if (isNum) {
      if (!invalid) {
        (e as any).target.value = +(e as any).target.value;
      }

      data = !invalid ? +numericData : numericData;
    }

    dispatch("input", e);
  }

  const selectStyle = `
<style>
  @import url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css");

  .switch {
    position: relative;
    display: inline-block;
    width: 60px;
    height: 34px;
  }

  .switch .switch__input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  .slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    -webkit-transition: 0.4s;
    transition: 0.4s;
    border-radius: 34px;
  }

  .slider:before {
    position: absolute;
    content: "";
    height: 26px;
    width: 26px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    -webkit-transition: 0.4s;
    transition: 0.4s;
    border-radius: 50%;
  }

  .switch__input:checked + .slider {
    background-color: #1982b1;
  }

  .switch__input:checked + .slider {
    box-shadow: 0 0 1px #1982b1; 
  }

  .switch__input:checked + .slider:before {
    -webkit-transform: translateX(26px);
    -ms-transform: translateX(26px);
    transform: translateX(26px);
  }

  
  [disabled] { cursor: inherit !important; }
</style>
`;
</script>

<div>
  {@html selectStyle}
</div>

{#if field}
  <div class="tooltip mb-2">

        {#if field.type === "text"}
          <div class="field" {id}>
            <p class="label">{field.label}</p>
            <input
              type="text"
              class={"input"}
              placeholder={field.placeholder}
              bind:value={data}
              on:input={_onInput}
              disabled={field.disabled}
            />
          </div>
        {:else if field.type === "number"}
          <div class="field" {id}>
            <p class="label">{field.label}</p>
            <input
              type="text"
              data-type="number"
              class={"input"}
              placeholder={field.placeholder}
              bind:value={numericData}
              on:input={_onInput}
              disabled={field.disabled}
              maxlength="15"
            />
          </div>
        {/if}
    
    {#if field.type === "checkbox"}
      <div style="display: flex; align-items: center;" class="mb-2">
        <label class="switch">
          <input
            class="switch__input"
            type="checkbox"
            bind:checked={data}
            {id}
            on:input
            disabled={field.disabled}
          />
          <span class="slider" />
        </label>
        <label for={id} class="label ml-2" style="cursor: pointer;">
          {field.label}
        </label>
      </div>
    {:else if field.type === "select"}
      {#if field.label}
        <p class="label">{field.label}</p>
      {/if}
      <div class={"select mb-2"} style="width: 100%;" {id}>
        <select
          disabled={field.disabled}
          style="width: 100%;"
          bind:value={data}
          on:change={_onSelectChange}
        >
          {#each field.options as option (option.value)}
            <option
              value={option.value}
              selected={option.selected}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          {/each}
        </select>
      </div>
    {/if}
  </div>
{/if}
