<script lang="ts">
  import BuilderStore from '$builder/store'
  import { getUnitBoundsString } from '../logic'

  import UnitEquipment from './UnitEquipment.svelte'
  import SchemaEquipment from './SchemaEquipment.svelte'


  type Props = {
    unitName: string
    unitData: IArmyUnit
  }

  const { unitName, unitData }: Props = $props()

  const unitHasErrors = (): boolean => unitData.errors.length > 0

  // Display unit error list on hover
  let isErrorListVisible = $state(false)
  const toggleErrorList = () => isErrorListVisible = !isErrorListVisible

  // Display schema magicItems/upgrades list
  let isItemListVisible = $state(false)
  const toggleItemList = (ev: MouseEvent) => {
    ev.preventDefault()
    isItemListVisible = !isItemListVisible
  }
</script>

<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
<div
  onclick={() => BuilderStore.removeUnit(unitName, unitData)}
  onmouseenter={toggleErrorList}
  onmouseleave={toggleErrorList}
  oncontextmenu={toggleItemList}
  class="flex relative cursor-pointer
    {unitHasErrors() ? 'bg-rose-200  hover:bg-rose-300' : 'bg-slate-50 hover:bg-gray-200'}"
>
  <div class="w-1/5">
    { unitData.count }
    {#if $BuilderStore.regimentCountAs.units[unitName] > 0 }
      (+{ $BuilderStore.regimentCountAs.units[unitName] })
    {/if}
  </div>
  <div class="w-1/5">{ unitName }</div>
  <div class="w-1/5">{ unitData.type }</div>
  <div class="w-1/5">{ unitData.points * unitData.count }</div>
  <div class="w-1/5">{ getUnitBoundsString(unitData) }</div>

  {#if isErrorListVisible && unitHasErrors()}
    <div class="absolute rounded px-2 py-1 bg-rose-400 z-50 top-10 left-1/2 
      transform -translate-x-1/2 -translate-y-1/2">
      {#each unitData.errors as error, i (i)} <div>{ error }</div> {/each}
    </div>
  {/if}
</div>

<UnitEquipment { unitName } { unitData } />

{#if isItemListVisible}
  <SchemaEquipment { unitName } { unitData } />
{/if}