<script lang="ts">
  import { route } from '@mateothegreat/svelte5-router'
  import { getContext } from 'svelte'


  const {
    armyName,
    armyCost,
    armyCostLimit,
    armyErrors
  } = getContext<IBuilderStore>('BuilderState')
</script>

<div class="text-center font-semibold">
  <a href="/" use:route>Return to homepage</a>
  <div>{ armyName }</div>
  <div>Army points: { $armyCost }/{ $armyCostLimit }</div>

  {#if $armyErrors.length > 0}
    <div class="text-red-600">
      <div>Army errors:</div>
      {#each $armyErrors as armyError (armyError)}
        <div>{ armyError }</div>
      {/each}
    </div>
  {/if}
</div>