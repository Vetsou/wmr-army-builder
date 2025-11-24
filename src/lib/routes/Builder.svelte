<script lang="ts">
  import { fetchPublicData } from './io'

  import BuilderStore from '$builder/store'
  import ArmyBuilder from '$components/ArmyBuilder.svelte'
  import ArmySchema from '$components/ArmySchema.svelte'
  import ArmyInfo from '$components/ArmyInfo.svelte'


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
</script>

{#await loadArmySchema()}
  <p>Loading army data...</p>
{:then}
  <section class="flex justify-evenly items-start">
    <ArmySchema />
    <ArmyInfo />
    <ArmyBuilder />
  </section>
{:catch error}
  <p>{ error.message }</p>
{/await}
