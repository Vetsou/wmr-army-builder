<script lang="ts">
  import { encodeArmyToUrl } from '$lib/builder/serialize/url'
  import { route } from '@mateothegreat/svelte5-router'
  import { getContext } from 'svelte'


  const {
    armyName,
    armyCost,
    armyCostLimit,
    armyErrors,
    units,
    lookup
  } = getContext<IBuilderStore>('BuilderState')

  const getArmyUrlString = async (): Promise<void> => {
    const encoded = encodeArmyToUrl(units, lookup)

    const url = new URL(window.location.href)
    url.search = encoded

    try {
      await navigator.clipboard.writeText(url.toString())
    } catch (err) {
      // HANDLE COPY ERROR
    }
  }
</script>

<div class="text-center font-semibold">
  <a href="/" use:route>Return to homepage</a>
  <div>{ armyName }</div>
  <div>Army points: { $armyCost }/{ $armyCostLimit }</div>

  <button onclick={async (): Promise<void> => await getArmyUrlString()}>Copy url</button>

  {#if $armyErrors.length > 0}
    <div class="text-red-600">
      <div>Army errors:</div>
      {#each $armyErrors as armyError (armyError)}
        <div>{ armyError }</div>
      {/each}
    </div>
  {/if}
</div>