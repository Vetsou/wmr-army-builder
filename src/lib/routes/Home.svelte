<script lang="ts">
  import { route } from '@mateothegreat/svelte5-router'
  import { fetchPublicData } from './io'

  const loadFactions = fetchPublicData<IFaction[]>('/factions.json')
    .then((data: IFaction[]) => data)
    .catch((err: string) => { throw new Error(`Error loading faction list (${err})`) })
</script>

<div class="flex justify-center">
  <div class="grid grid-cols-3 gap-5">
    {#await loadFactions}
      <p>Loading factions data...</p>
    {:then factions}
      {#each factions as faction, i (i)}
        <div><a href="/factions/{ faction.fileName }" use:route>{ faction.name }</a></div>
      {/each}
    {:catch error}
      <p>{ error.message }</p>
    {/await}
  </div>
</div>