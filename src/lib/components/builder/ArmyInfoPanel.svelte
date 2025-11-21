<script lang="ts">
  import { route } from '@mateothegreat/svelte5-router'
  import builderStore from '$builder/store'
</script>

<div class="text-center font-semibold">
  <a href="/" use:route>Return to homepage</a>
  <div>{ $builderStore.armyName }</div>
  <div>Army points: { $builderStore.armyCost }/{ $builderStore.armyCostLimit }</div>

  {#if $builderStore.armyErrors.length > 0}
    <div class="text-red-600">
      <div>Army errors:</div>
      {#each $builderStore.armyErrors as armyError, i (i)}
        <div>{ armyError }</div>
      {/each}
    </div>
  {/if}
</div>