<script lang="ts">
  import BuilderStore from '$builder/store'


  type Props = {
    unitName: string
    unitData: IArmyUnit
  }

  const { unitName, unitData }: Props = $props()
</script>

{#each Object.entries(unitData.equippedItems) as [itemName, itemData], i (i)}
  <!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
  <div class="flex flex-row-reverse gap-x-4 select-none cursor-pointer hover:bg-gray-200"
      onclick={() => BuilderStore.unequipItem(unitName, itemName)}>
    <div>{ itemName }</div>
    <div>{ itemData.type }</div>
    <div>{ itemData.costForUnit * itemData.count }</div>
    <div>{ itemData.count }</div>
  </div>
{/each}

{#each Object.entries(unitData.equippedUpgrades) as [upgradeName, upgradeData], i (i)}
  <!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
  <div class="flex flex-row-reverse gap-x-4 select-none cursor-pointer hover:bg-gray-200"
      onclick={() => BuilderStore.unequipUpgrade(unitName, upgradeName)}>
    <div>{ upgradeName }</div>
    <div>{ upgradeData.type }</div>
    <div>{ upgradeData.cost * upgradeData.count }</div>
    <div>{ upgradeData.count }</div>
  </div>
{/each}

{#each Object.entries(unitData.addedStands) as [standName, standData], i (i)}
  <!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
  <div class="flex flex-row-reverse gap-x-4 select-none cursor-pointer hover:bg-gray-200"
      onclick={() => BuilderStore.removeStand(unitName, standName)}>
    <div>{ standName }</div>
    <div>{ standData.type }</div>
    <div>{ standData.points * standData.count }</div>
    <div>{ standData.count }</div>
  </div>
{/each}