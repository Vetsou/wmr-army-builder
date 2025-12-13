<script lang="ts">
  import { getCountAsRuleForAdd, getCountAsRuleForRemove } from './logic/regiments'
  import { getContext } from 'svelte'
  import { fade } from 'svelte/transition'


  type SelectedValue<T> = { name: string; data: T } | null

  type Props = {
    selectedRegimentName: string
    showModal: boolean
    mode: 'add' | 'remove'
  }

  let {
    showModal = $bindable<boolean>(),
    selectedRegimentName,
    mode
  }: Props = $props()
  
  const builderStore = getContext<IBuilderStore>('BuilderState')

  let dialog: HTMLDialogElement | undefined = $state()
  let allowedCountAsData: CountAsRuleResult = $state(getCountAsRuleForAdd(builderStore, selectedRegimentName))

  $effect(() => {
    if (!showModal) return

    allowedCountAsData = mode === 'add'
      ? getCountAsRuleForAdd(builderStore, selectedRegimentName)
      : getCountAsRuleForRemove(builderStore, selectedRegimentName)

    dialog?.showModal()
  })

  // Unit/Upgrade selected by user
  let selectedUnit: SelectedValue<ISchemaUnit> = $state(null)
  let selectedUpgrade: SelectedValue<ISchemaUpgrade> = $state(null)
  const onUnitSelect = (name: string, data: ISchemaUnit): void => { selectedUnit = { name, data } }
  const onUpgradeSelect = (name: string, data: ISchemaUpgrade): void => { selectedUpgrade = { name, data } }

  const isConfirmDisabled = (): boolean => {
    const needsUnit = allowedCountAsData.units.length > 0
    const needsUpg = allowedCountAsData.upgrades.length > 0

    return (needsUnit && !selectedUnit) || (needsUpg && !selectedUpgrade)
  }

  const onBeforeClose = (): void => {
    selectedUnit = null
    selectedUpgrade = null

    dialog?.close()
    showModal = false
  }

  const onCancel = (): void => onBeforeClose()

  const onConfirm = (): void => {
    const caData = {
      unitName: selectedUnit?.name,
      upgradeName: selectedUpgrade?.name
    }

    mode === 'add'
      ? builderStore.addRegiment(selectedRegimentName, caData)
      : builderStore.removeRegiment(selectedRegimentName, caData)

    onBeforeClose()
  }
</script>

{#snippet selectableEntry(name: string, onclick: () => void, isSelected: boolean)}
  <!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
  <div
    { onclick }
    class="p-2 border rounded-md cursor-pointer
      { isSelected ? 'bg-blue-100 hover:bg-blue-100' : 'hover:bg-gray-100' }"
  >
    { name }
  </div>
{/snippet}

<dialog
  bind:this={ dialog }
  transition:fade={ { duration: 150 } }
  onclick={ (e): void => { if (e.target === dialog) onCancel() } }
  class="count-as-dialog backdrop:bg-black/50"
>
  <div class="bg-white rounded-2xl p-6 w-full min-w-md">
    <div class="text-lg font-semibold mb-4">
      Unit name: { selectedRegimentName }
    </div>
    
    <div>
      {#if mode === 'add'}
        Select unit that you want to count as max/min limits for this regiment.
      {:else}
        Select unit that you want to remove count as limits from, for this regiment.
      {/if}
    </div>

    <div class="space-y-2 mt-4">
      {#if allowedCountAsData.units.length !== 0}
        <div class="font-medium">Units to select:</div>
        {#each allowedCountAsData.units as [name, data] (name)}
          {@render selectableEntry(name, () => onUnitSelect(name, data), selectedUnit?.name === name)}
        {/each}
      {/if}

      {#if allowedCountAsData.upgrades.length !== 0}
        <div class="font-medium mt-4">Upgrades to select:</div>
        {#each allowedCountAsData.upgrades as [name, data] (name)}
          {@render selectableEntry(name, () => onUpgradeSelect(name, data), selectedUpgrade?.name === name)}
        {/each}
      {/if}
    </div>

    <div>
      <button
        onclick={ (): void => onCancel() }
        class="bg-gray-300 text-gray-800 rounded-md px-4 py-2 hover:bg-gray-400 cursor-pointer"
      >
        Cancel
      </button>

      <button
        onclick={ (): void => onConfirm() } disabled={ isConfirmDisabled() }
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