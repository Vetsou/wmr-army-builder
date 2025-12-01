<script lang="ts">
  import { getContext } from 'svelte'
  import RegimentModal from './RegimentModal.svelte'
  import { getUnitBoundsString } from './logic'


  // Display modal and set it's state
  let showModal = $state(false)
  let selectedRegimentName: string = $state('')

  const toggleCountAsModal = (
    regimentName: string
  ): void => {
    selectedRegimentName = regimentName
    showModal = true
  }

  const builderStore = getContext<IBuilderStore>('BuilderState')
</script>

{#snippet tableHeader()}
  <div class="flex font-semibold">
    <div class="w-1/4">Name</div>
    <div class="w-1/4">Type</div>
    <div class="w-1/4">Points</div>
    <div class="w-1/4">Min/Max</div>
  </div>
{/snippet}

{#snippet schemaRow(name: string, data: ISchemaUnit | ISchemaRegiment, onclick: () => void)}
  <!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
  <div
    onclick={onclick}
    class="flex hover:bg-gray-200 cursor-pointer"
  >
    <div class="w-1/4">{name}</div>
    <div class="w-1/4">{data.type}</div>
    <div class="w-1/4">{data.points}</div>
    <div class="w-1/4">{getUnitBoundsString(data)}</div>
  </div>
{/snippet}

<div class="w-1/3">
  <div class="divide-y bg-gray-100 divide-gray-200 text-center select-none">
    {@render tableHeader()}

    {#each Object.entries($builderStore.lookup.units) as [unitName, unitData] (unitName)}
      {@render schemaRow(unitName, unitData, () => builderStore.addUnit(unitName))}
    {/each}
  </div>

  <div class="divide-y bg-gray-100 divide-gray-200 text-center select-none mt-14">
    {@render tableHeader()}

    {#each Object.entries($builderStore.lookup.regiments) as [regimentName, regimentData] (regimentName)}
      {@render schemaRow(regimentName, regimentData, () => toggleCountAsModal(regimentName))}
    {/each}
  </div>
</div>

<RegimentModal bind:showModal mode='add' { selectedRegimentName } />