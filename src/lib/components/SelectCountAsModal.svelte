<script lang="ts">
  import BuilderStore from '$builder/store'
  import { fade } from 'svelte/transition'
  import { getRegimentCountAsRuleUnits, type CountAsRuleResult } from "$builder/helper/regimentsHelper"

  type Props = {
    showModal: boolean
    selectedRegiment: { name: string, data: ISchemaRegiment }
    readonly schemaUnits: Record<string, ISchemaUnit>
  }

  let {
    showModal = $bindable<boolean>(),
    selectedRegiment,
    schemaUnits
  }: Props = $props()
  
  let dialog: HTMLDialogElement | undefined = $state()
  let countAsDataResult: CountAsRuleResult | null = $state(null)

  // Unit/Upgrade selected by user
  let selectedUnit: { name: string; data: ISchemaUnit } | null = $state(null)
  let selectedUpgrade: { name: string; data: ISchemaUpgrade } | null = $state(null)

  $effect(() => {
    if (showModal) {
      dialog?.showModal()
      countAsDataResult = getRegimentCountAsRuleUnits($BuilderStore, schemaUnits, selectedRegiment.data)
    }
  })

  const isDisabled = () => {
    const unitRequired = countAsDataResult?.units?.length !== 0
    const upgradeRequired = countAsDataResult?.upgrades?.length !== 0

    const unitSelected = !unitRequired || selectedUnit !== null
    const upgradeSelected = !upgradeRequired || selectedUpgrade !== null

    return !(unitSelected && upgradeSelected)
  }

  const onBeforeClose = () => {
    selectedUnit = null
    selectedUpgrade = null

    dialog?.close()
    showModal = false
  }

  const onCancel = () => onBeforeClose()
  const onConfirm = () => {
    BuilderStore.addUnit(selectedRegiment.name, selectedRegiment.data)
    onBeforeClose()
  }
</script>

<dialog
  bind:this={dialog}
  transition:fade={{ duration: 150 }}
  onclose={() => (showModal = false)}
  onclick={(e) => { if (e.target === dialog) onCancel() }}
  class="count-as-dialog backdrop:bg-black/50"
>
  <div class="bg-white rounded-2xl p-6 w-full min-w-md">
    <div class="text-lg font-semibold mb-4">
      Unit name: {selectedRegiment.name}
    </div>
    
    <div>
      Select units that you want to count as max/min limits for this regiment.
    </div>

    <div class="space-y-2 mt-4">
      {#if countAsDataResult?.units.length != 0}
        <div class="font-medium">Units to select:</div>
        {#each countAsDataResult?.units as [name, data]}
          <!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
          <div 
            class="p-2 border rounded-md hover:bg-gray-100 cursor-pointer {selectedUnit?.name === name ? 'bg-blue-100' : ''}"
            onclick={() => selectedUnit = { name, data }}
          >
            {name}
          </div>
        {/each}
      {/if}

      {#if countAsDataResult?.upgrades.length != 0}
        <div class="font-medium mt-4">Upgrades to select:</div>
        {#each countAsDataResult?.upgrades as [name, data]}
          <!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
          <div 
            class="p-2 border rounded-md hover:bg-gray-100 cursor-pointer {selectedUpgrade?.name === name ? 'bg-blue-100' : ''}" 
            onclick={() => selectedUpgrade = { name, data }}
          >
            {name}
          </div>
        {/each}
      {/if}
    </div>

    <div>
      <button onclick={() => onCancel()}
        class="bg-gray-300 text-gray-800 rounded-md px-4 py-2 hover:bg-gray-400 cursor-pointer"
      >
        Cancel
      </button>

      <button onclick={() => onConfirm()} disabled={isDisabled()}
        class="bg-blue-600 text-white rounded-md mt-4 px-4 py-2 hover:bg-blue-700 cursor-pointer
          disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed"
      >
        Confirm
      </button>
    </div>
  </div>
</dialog>

<style>
  .count-as-dialog {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 0;
    border: none;
  }

  .count-as-dialog:focus {
    outline: none;
  }
</style>