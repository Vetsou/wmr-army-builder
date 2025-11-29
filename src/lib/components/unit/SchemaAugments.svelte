<script lang="ts">
  import { getUnitItemCost } from '$components/logic'
  import { getContext } from 'svelte'


  type Props = {
    unitName: string
    unitData: IArmyUnit
  }

  const builderStore = getContext<IBuilderStore>('BuilderState')
  const { unitName, unitData }: Props = $props()
</script>

{#each builderStore.getUnitEquipableItems(unitData) as [itemName, itemData], i (i)}
  <!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
  <div class="flex gap-x-4 select-none cursor-pointer hover:bg-gray-200"
    onclick={ (): void => builderStore.equipItem(unitName, itemName) }
  >
    <div>{ itemName }</div>
    <div>{ itemData.type }</div>
    <div>{ getUnitItemCost(unitData, itemData) }</div>
  </div>
{/each}

{#each builderStore.getUnitEquipableUpgrades(unitData) as [upgradeName, upgradeData], i (i)}
  <!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
  <div class="flex gap-x-4 select-none cursor-pointer hover:bg-gray-200"
    onclick={ (): void => builderStore.equipUpgrade(unitName, upgradeName) }
  >
    <div>{ upgradeName }</div>
    <div>{ upgradeData.type }</div>
    <div>{ upgradeData.cost }</div>
  </div>
{/each}

{#each builderStore.getAttachableStands(unitData) as [standName, standData], i (i)}
  <!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
  <div class="flex gap-x-4 select-none cursor-pointer hover:bg-gray-200"
    onclick={ (): void => builderStore.addStand(unitName, standName) }
  >
    <div>{ standName }</div>
    <div>{ standData.type }</div>
    <div>{ standData.points }</div>
  </div>
{/each}