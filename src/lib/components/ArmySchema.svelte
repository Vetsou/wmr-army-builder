<script lang="ts">
  import BuilderStore from '$builder/store'
  import { getUnitBoundsString } from '$helper/unitHelper'

  type Props = {
    units: Record<string, ISchemaUnit>
    regiments: Record<string, ISchemaRegiment>
  }

  const { units, regiments }: Props = $props()
</script>

<div class="w-1/3">
  <div class="divide-y bg-gray-100 divide-gray-200 text-center select-none">
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

  <div class="divide-y bg-gray-100 divide-gray-200 text-center select-none mt-14">
    <div class="flex font-semibold">
      <div class="w-1/4">Name</div>
      <div class="w-1/4">Type</div>
      <div class="w-1/4">Points</div>
      <div class="w-1/4">Min/Max</div>
    </div>
    {#each Object.entries(regiments) as [regimentsName, regimentsData], i (i)}
      <div onclick={() => BuilderStore.addUnit(regimentsName, regimentsData)} class="flex hover:bg-gray-200 cursor-pointer">
        <div class="w-1/4">{ regimentsName }</div>
        <div class="w-1/4">{ regimentsData.type }</div>
        <div class="w-1/4">{ regimentsData.points }</div>
        <div class="w-1/4">{ getUnitBoundsString(regimentsData) }</div>
      </div>
    {/each}
  </div>
</div>


