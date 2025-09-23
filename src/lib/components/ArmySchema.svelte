<script lang="ts">
  import BuilderStore from '$builder/store'
  import { getUnitBoundsString } from '$helper/unitHelper'

  type Props = {
    units: Record<string, ISchemaUnit>
  }

  const { units }: Props = $props()
</script>

<div class="w-1/3 divide-y bg-gray-100 divide-gray-200 text-center select-none">
  <div class="flex font-semibold">
    <div class="w-1/4">Name</div>
    <div class="w-1/4">Type</div>
    <div class="w-1/4">Points</div>
    <div class="w-1/4">Min/Max</div>
  </div>
  {#each Object.entries(units) as [unitName, unitData], i (i)}
    <div onclick={() => BuilderStore.addUnit(unitName, unitData)} class="flex hover:bg-gray-200 cursor-pointer">
      <div class="w-1/4">{ unitName }</div>
      <div class="w-1/4">{ unitData.type }</div>
      <div class="w-1/4">{ unitData.points }</div>
      <div class="w-1/4">{ getUnitBoundsString(unitData) }</div>
    </div>
  {/each}
</div>