<script lang="ts">
  import BuilderStore from '$builder/store'
  import { isRegiment } from '$builder/types/guards'


  type Props = {
    unitName: string
    unitData: IArmyUnit
  }

  const { unitName, unitData }: Props = $props()

  const getUnitItemCost = (
    unit: IArmyUnit,
    item: ISchemaMagicItem
  ): number => {
    if (typeof item.cost === 'number') return item.cost

    const statCompareValue = unit[item.stat!]?.toString() || '-'
    return item.cost[statCompareValue]
  }

  const getUnitEquipableItems = (
    unitData: ISchemaUnit,
    magicItems: Record<string, ISchemaMagicItem>
  ): [string, ISchemaMagicItem][] => {
    if (isRegiment(unitData)) return []

    return Object.entries(magicItems).filter(([itemName, item]) =>
      item.allowedUnits.includes(unitData.type) || unitData.customItems?.includes(itemName))
  }

  const getUnitUpgrades = (
    unitData: ISchemaUnit,
    armyUpgrades?: Record<string, ISchemaUpgrade>
  ): [string, ISchemaUpgrade][] => {
    return Object.entries(armyUpgrades ?? {})
      .filter(([upgradeName]) => unitData.upgrades?.includes(upgradeName))
  }

  const getUnitStands = (
    unitData: ISchemaUnit,
    armyStands?: Record<string, ISchemaUnit>
  ): [string, ISchemaUnit][] => {
    return Object.entries(armyStands ?? {})
      .filter(([standName]) => unitData.extraStands?.includes(standName))
  }
</script>

{#each getUnitEquipableItems(unitData, $BuilderStore.lookup.magicItems) as [itemName, itemData], i (i)}
  <!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
  <div class="flex gap-x-4 select-none cursor-pointer hover:bg-gray-200"
      onclick={() => BuilderStore.equipItem(unitName, itemName, itemData)}>
    <div>{ itemName }</div>
    <div>{ itemData.type }</div>
    <div>{ getUnitItemCost(unitData, itemData) }</div>
  </div>
{/each}

{#each getUnitUpgrades(unitData, $BuilderStore.lookup.armyUpgrades) as [upgradeName, upgradeData], i (i)}
  <!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
  <div class="flex gap-x-4 select-none cursor-pointer hover:bg-gray-200"
      onclick={() => BuilderStore.equipUpgrade(unitName, upgradeName, upgradeData)}>
    <div>{ upgradeName }</div>
    <div>{ upgradeData.type }</div>
    <div>{ upgradeData.cost }</div>
  </div>
{/each}

{#each getUnitStands(unitData, $BuilderStore.lookup.armyStands) as [standName, standData], i (i)}
  <!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
  <div class="flex gap-x-4 select-none cursor-pointer hover:bg-gray-200"
      onclick={() => BuilderStore.addStand(unitName, standName, standData)}>
    <div>{ standName }</div>
    <div>{ standData.type }</div>
    <div>{ standData.points }</div>
  </div>
{/each}