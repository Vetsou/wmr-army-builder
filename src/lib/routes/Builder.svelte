<script lang="ts">
  import BuilderStore from '$builder/store'
  import ArmyBuilder from '$components/ArmyBuilder.svelte'
  import ArmySchema from '$components/ArmySchema.svelte'
  import ArmyStatus from '$components/ArmyStatus.svelte'

  import { fetchPublicData } from '../io'

  const { route } = $props()
  const factionFile = route.result.path.params.name

  const loadArmySchema = async (): Promise<IArmySchema> => {
    try {
      const [armySchema, magicItems] = await Promise.all([
        fetchPublicData<IArmySchema>(`/armies/${ factionFile }.json`),
        fetchPublicData<Record<string, ISchemaMagicItem>>('/magicItems.json')
      ])

      if (BuilderStore.getState().armyName !== armySchema.name) {
        BuilderStore.initNewArmy(armySchema, magicItems)
      }

      return armySchema
    } catch (err) {
      throw new Error(`Error loading ${ factionFile } army data (${ err })`)
    }
  }
</script>

{#await loadArmySchema()}
  <p>Loading army data...</p>
{:then armyData}
  <section class="flex justify-evenly items-start">
    <ArmySchema units={armyData.units}/>
    <ArmyStatus />
    <ArmyBuilder />
  </section>
{:catch error}
  <p>{ error.message }</p>
{/await}
