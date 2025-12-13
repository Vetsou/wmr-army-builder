<script lang="ts">
  import { getContext } from 'svelte'


  type Props = {
    unitName: string
    unitData: IArmyUnit
  }

  const { unitName, unitData }: Props = $props()
  const builderStore = getContext<IBuilderStore>('BuilderState')
</script>

{#snippet entry(name: string, data: IArmyMagicItem | IArmyUpgrade | IArmyStand, onclick: () => void, cost: number)}
  <!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
  <div
    class="flex flex-row-reverse gap-x-4 select-none cursor-pointer hover:bg-gray-200"
    { onclick }
  >
    <div>{ name }</div>
    <div>{ data.type }</div>
    <div>{ cost }</div>
    <div>{ data.count }</div>
  </div>
{/snippet}

{#each Object.entries(unitData.equippedItems) as [itemName, itemData] (itemName)}
  {@render
    entry(itemName, itemData,
      () => builderStore.unequipItem(unitName, itemName),
      itemData.costForUnit * itemData.count)}
{/each}

{#each Object.entries(unitData.equippedUpgrades) as [upgradeName, upgradeData] (upgradeName)}
  {@render
    entry(upgradeName, upgradeData,
      () => builderStore.unequipUpgrade(unitName, upgradeName),
      upgradeData.cost * upgradeData.count)}
{/each}

{#each Object.entries(unitData.addedStands) as [standName, standData] (standName)}
  {@render
    entry(standName, standData,
      () => builderStore.removeStand(unitName, standName),
      standData.points * standData.count)}
{/each}