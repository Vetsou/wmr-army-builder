<script lang="ts">
  import { route } from '@mateothegreat/svelte5-router'
  import BuilderStore from '$builder/store'
</script>

<div class="text-center font-semibold">
  <a href="/" use:route>Return to homepage</a>
  <div>{ $BuilderStore.armyName }</div>
  <div>Army points: { $BuilderStore.armyCost }/{ $BuilderStore.armyCostLimit }</div>

  {#if $BuilderStore.armyErrors.length > 0}
    <div>Army errors:</div>
    {#each $BuilderStore.armyErrors as armyError, i (i)}
      <div>{ armyError }</div>
    {/each}
  {/if}
</div>