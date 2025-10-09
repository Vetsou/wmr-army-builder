<script lang="ts">
  import BuilderStore from '$builder/store'
  import ArmyBuilder from '$components/ArmyBuilder.svelte'
  import ArmySchema from '$components/ArmySchema.svelte'
  import ArmyStatus from '$components/ArmyStatus.svelte'

  import { fetchPublicData } from '../io'

  const { route } = $props()
  const factionFile = route.result.path.params.name

  type ArmyUnitsData = {
    units: Record<string, ISchemaUnit>
    regiments: Record<string, ISchemaRegiment>
  }

  const filterAvailableRegiments = (
    regimentsOfRenown: Record<string, ISchemaRegiment>,
    armyName: string
  ) => {
    return Object.fromEntries(
      Object.entries(regimentsOfRenown)
        .filter(([_, regimentData]) => !regimentData.incompatibleFactions?.includes(armyName))
    )
  }

  const loadArmySchema = async (): Promise<ArmyUnitsData> => {
    try {
      const [armySchema, magicItems, regimentsOfRenown] = await Promise.all([
        fetchPublicData<IArmySchema>(`/armies/${ factionFile }.json`),
        fetchPublicData<Record<string, ISchemaMagicItem>>('/magicItems.json'),
        fetchPublicData<Record<string, ISchemaRegiment>>('/regimentsOfRenown.json')
      ])

      if (BuilderStore.getState().armyName !== armySchema.name) {
        BuilderStore.initNewArmy(armySchema, magicItems)
      }

      return {
        units: armySchema.units,
        regiments: filterAvailableRegiments(regimentsOfRenown, armySchema.name)
      }
    } catch (err) {
      throw new Error(`Error loading ${ factionFile } army data (${ err })`)
    }
  }
</script>

{#await loadArmySchema()}
  <p>Loading army data...</p>
{:then armyData}
  <section class="flex justify-evenly items-start">
    <ArmySchema units={armyData.units} regiments={armyData.regiments} />
    <ArmyStatus />
    <ArmyBuilder />
  </section>
{:catch error}
  <p>{ error.message }</p>
{/await}
