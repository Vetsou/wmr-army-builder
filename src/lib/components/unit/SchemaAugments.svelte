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

{#snippet entry(name: string, data: ISchemaMagicItem | ISchemaUpgrade | ISchemaUnit, onclick: () => void, cost: number)}
  <!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
  <div class="flex gap-x-4 select-none cursor-pointer hover:bg-gray-200" { onclick }>
    <div>{ name }</div>
    <div>{ data.type }</div>
    <div>{ cost }</div>
  </div>
{/snippet}

{#each builderStore.getUnitEquipableItems(unitData) as [itemName, itemData] (itemName)}
  {@render
    entry(itemName, itemData,
      () => builderStore.equipItem(unitName, itemName),
      getUnitItemCost(unitData, itemData))}
{/each}

{#each builderStore.getUnitEquipableUpgrades(unitData) as [upgradeName, upgradeData] (upgradeName)}
  {@render
    entry(upgradeName, upgradeData,
      () => builderStore.equipUpgrade(unitName, upgradeName),
      upgradeData.cost)}
{/each}

{#each builderStore.getAttachableStands(unitData) as [standName, standData] (standName)}
  {@render
    entry(standName, standData,
      () => builderStore.addStand(unitName, standName),
      standData.points)}
{/each}