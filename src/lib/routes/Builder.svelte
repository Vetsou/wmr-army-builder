<script lang="ts">
  import { fetchPublicData } from './io'

  import BuilderStore from '$builder/store'
  import BuilderPanel from '$components/builder/BuilderPanel.svelte'
  import UrlPanel from '$components/url/UrlPanel.svelte'


  const { route } = $props()
  const factionFile = route.result.path.params.name

  const loadArmySchema = async (): Promise<void> => {
    try {
      const [armySchema, magicItems, regimentsOfRenown] = await Promise.all([
        fetchPublicData<IArmySchema>(`/armies/${ factionFile }.json`),
        fetchPublicData<Record<string, ISchemaMagicItem>>('/magicItems.json'),
        fetchPublicData<Record<string, ISchemaRegiment>>('/regimentsOfRenown.json')
      ])

      if (BuilderStore.getState().armyName !== armySchema.name) {
        BuilderStore.initNewArmy(armySchema, magicItems, regimentsOfRenown)
      }
    } catch (err) {
      throw new Error(`Error loading ${ factionFile } army data (${ err })`)
    }
  }

  const PanelList = {
    builder: BuilderPanel,
    encoder: UrlPanel
  }

  let panel = $state<'builder' | 'encoder'>('builder')
  let PanelComponent =  $derived(PanelList[panel])
</script>

{#await loadArmySchema()}
  <p>Loading army data...</p>
{:then}
  <section class="flex justify-evenly items-start">
    <PanelComponent />
  </section>
{:catch error}
  <p>{ error.message }</p>
{/await}
