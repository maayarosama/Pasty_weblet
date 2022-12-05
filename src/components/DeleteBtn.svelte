<svelte:options tag="tf-delete-btn" />

<script lang="ts">
  export let name: string;
</script>

<div class="is-flex is-justify-content-space-between is-align-items-center">
  <p on:click class="is-size-5 has-text-weight-bold">{name}</p>
  <span  class= "button"style={`background-color: #1982b1; color: white`} on:click>
    - Delete
  </span>
</div>

<style lang="scss" scoped>
  @import url("https://cdn.jsdelivr.net/npm/bulma@0.9.3/css/bulma.min.css");
  @import url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css");
  .icon {
    color: #454545 !important;
    cursor: pointer;
  }
</style>
