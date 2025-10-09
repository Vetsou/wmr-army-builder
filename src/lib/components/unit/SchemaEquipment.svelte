<script lang="ts">
  import BuilderStore from '$builder/store'
  import { getUnitEquipableItems, getUnitItemCost, getUnitStands, getUnitUpgrades } from '$helper/unitHelper'

  type Props = {
    unitName: string
    unitData: IArmyUnit
  }
  
  const { unitName, unitData }: Props = $props()
</script>

{#each getUnitEquipableItems(unitData, $BuilderStore.lookup.magicItems) as [itemName, itemData], i (i)}
  <div class="flex gap-x-4 select-none cursor-pointer hover:bg-gray-200"
      onclick={() => BuilderStore.equipItem(unitName, itemName, itemData)}>
    <div>{ itemName }</div>
    <div>{ itemData.type }</div>
    <div>{ getUnitItemCost(unitData, itemData) }</div>
  </div>
{/each}

{#each getUnitUpgrades(unitData, $BuilderStore.lookup.armyUpgrades) as [upgradeName, upgradeData], i (i)}
  <div class="flex gap-x-4 select-none cursor-pointer hover:bg-gray-200"
      onclick={() => BuilderStore.equipUpgrade(unitName, upgradeName, upgradeData)}>
    <div>{ upgradeName }</div>
    <div>{ upgradeData.type }</div>
    <div>{ upgradeData.cost }</div>
  </div>
{/each}

{#each getUnitStands(unitData, $BuilderStore.lookup.armyStands) as [standName, standData], i (i)}
  <div class="flex gap-x-4 select-none cursor-pointer hover:bg-gray-200"
      onclick={() => BuilderStore.addStand(unitName, standName, standData)}>
    <div>{ standName }</div>
    <div>{ standData.type }</div>
    <div>{ standData.points }</div>
  </div>
{/each}