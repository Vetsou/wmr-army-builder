<script lang="ts">
  import BuilderStore from '$builder/store'
  import { getUnitItemCost } from '$helper/unitHelper'

  type Props = {
    unitName: string
    unitData: IArmyUnit
  }
  
  const { unitName, unitData }: Props = $props()

  const getEquipableItems = (magicItems: Record<string, ISchemaMagicItem>): [string, ISchemaMagicItem][] => {
    return Object.entries(magicItems).filter(([itemName, item]) =>
      item.allowedUnits.includes(unitData.type) || unitData.customItems?.includes(itemName))
  }

  const getUnitUpgrades = (armyUpgrades?: Record<string, ISchemaUpgrade>): [string, ISchemaUpgrade][] => {
    return Object.entries(armyUpgrades ?? {}).filter(([upgradeName]) => unitData.upgrades?.includes(upgradeName))
  }

  const getUnitStands = (armyStands?: Record<string, ISchemaUnit>): [string, ISchemaUnit][] => {
    return Object.entries(armyStands ?? {}).filter(([standName]) => unitData.extraStands?.includes(standName))
  }
</script>

{#each getEquipableItems($BuilderStore.lookup.magicItems) as [itemName, itemData], i (i)}
  <div class="flex gap-x-4 select-none cursor-pointer hover:bg-gray-200"
      onclick={() => BuilderStore.equipItem(unitName, itemName, itemData)}>
    <div>{ itemName }</div>
    <div>{ itemData.type }</div>
    <div>{ getUnitItemCost(unitData, itemData) }</div>
  </div>
{/each}

{#each getUnitUpgrades($BuilderStore.lookup.armyUpgrades) as [upgradeName, upgradeData], i (i)}
  <div class="flex gap-x-4 select-none cursor-pointer hover:bg-gray-200"
      onclick={() => BuilderStore.equipUpgrade(unitName, upgradeName, upgradeData)}>
    <div>{ upgradeName }</div>
    <div>{ upgradeData.type }</div>
    <div>{ upgradeData.cost }</div>
  </div>
{/each}

{#each getUnitStands($BuilderStore.lookup.armyStands) as [standName, standData], i (i)}
  <div class="flex gap-x-4 select-none cursor-pointer hover:bg-gray-200"
      onclick={() => BuilderStore.addStand(unitName, standName, standData)}>
    <div>{ standName }</div>
    <div>{ standData.type }</div>
    <div>{ standData.points }</div>
  </div>
{/each}