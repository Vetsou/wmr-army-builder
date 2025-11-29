<script lang="ts">
  import { getContext } from 'svelte'
  import Unit from '$components/unit/Unit.svelte'


  const builderStore = getContext<IBuilderStore>('BuilderState')
</script>

<div class="w-1/3 divide-y bg-gray-100 divide-gray-200 text-center select-none">
  <div class="flex bg-gray-100 font-semibold">
    <div class="w-1/5">Count</div>
    <div class="w-1/5">Name</div>
    <div class="w-1/5">Type</div>
    <div class="w-1/5">Points</div>
    <div class="w-1/5">Min/Max</div>
  </div>
  {#each Object.entries($builderStore.units) as [unitName, unitData], i (i)}
    <Unit { unitName } { unitData } />
  {/each}
</div>