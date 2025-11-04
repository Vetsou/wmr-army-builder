<script lang="ts">
  import BuilderStore from '$builder/store'
  import RegimentSelectModal from './RegimentSelectModal.svelte'
  import { getUnitBoundsString } from './logic'


  type Props = {
    units: Record<string, ISchemaUnit>
    regiments: Record<string, ISchemaRegiment>
  }

  const { units, regiments }: Props = $props()

  let showModal = $state(false)
  let selectedRegiment: { name: string, data: ISchemaRegiment } = $state({
    name: Object.keys(regiments)[0],
    data: Object.values(regiments)[0]
  })

  // Display modal and set it's state
  const toggleCountAsModal = (regimentName: string, regimentData: ISchemaRegiment) => {
    selectedRegiment = { name: regimentName, data: regimentData }
    showModal = true
  }
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
      <!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
      <div onclick={ () => BuilderStore.addUnit(unitName, unitData) } class="flex hover:bg-gray-200 cursor-pointer">
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
    {#each Object.entries(regiments) as [regimentName, regimentData], i (i)}
      <!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
      <div onclick={ () => toggleCountAsModal(regimentName, regimentData) } 
        class="flex hover:bg-gray-200 cursor-pointer"
      >
        <div class="w-1/4">{ regimentName }</div>
        <div class="w-1/4">{ regimentData.type }</div>
        <div class="w-1/4">{ regimentData.points }</div>
        <div class="w-1/4">{ getUnitBoundsString(regimentData) }</div>
      </div>
    {/each}
  </div>
</div>

<RegimentSelectModal bind:showModal processedRegiment={ selectedRegiment } schemaUnits={ units } />