<script lang="ts">
  import BuilderStore from '$builder/store'
  import BuilderItem from './items/BuilderItem.svelte'

  const headers = ['Count', 'Name', 'Type', 'Points', 'Min/Max']
</script>

<table class="w-1/3 divide-y divide-gray-200 text-center whitespace-nowrap">
  <thead class="bg-gray-100">
    <tr class="select-none">
      {#each headers as header}<th class="px-3">{ header }</th>{/each}
    </tr>
  </thead>
  <tbody>
    {#each $BuilderStore.units as unit}
      <BuilderItem {unit} />
    {/each}
  </tbody>
</table>