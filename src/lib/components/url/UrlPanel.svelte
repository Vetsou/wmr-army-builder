<script lang="ts">
  import { onMount } from 'svelte'
  import { encodeArmyToUrl } from '$builder/serialization'
  import builderStore from '$builder/store'


  let shareUrl = ""

  onMount(() => {
    const encoded = encodeArmyToUrl(builderStore.getState())
    shareUrl = `${window.location.origin}/factions/orcs?${encoded}`
  })
</script>

<div class="p-4 space-y-3">
  <div class="mt-2 p-2 bg-gray-200 rounded break-all">
    <strong>Your URL:</strong>
    {shareUrl}
  </div>
</div>