<script lang="ts">
  import { fetchPublicData } from './io'

  import BuilderContextProvider from '$components/providers/BuilderContextProvider.svelte'

  import ArmyList from '$lib/components/ArmyList.svelte'
  import SchemaList from '$lib/components/SchemaList.svelte'
  import ArmyInfo from '$components/ArmyInfo.svelte'


  type ArmySchemaData = {
    schema: IArmySchema
    items: Record<string, ISchemaMagicItem>
    regiments: Record<string, ISchemaRegiment>
  }

  const { route } = $props()
  const factionFile = route.result.path.params.name

  const loadArmySchema = async (): Promise<ArmySchemaData> => {
    try {
      const [schema, items, regiments] = await Promise.all([
        fetchPublicData<IArmySchema>(`/armies/${ factionFile }.json`),
        fetchPublicData<Record<string, ISchemaMagicItem>>('/magicItems.json'),
        fetchPublicData<Record<string, ISchemaRegiment>>('/regimentsOfRenown.json')
      ])

      return { schema, items, regiments }
    } catch (err) {
      throw new Error(`Error loading ${ factionFile } army data (${ err })`)
    }
  }
</script>

{#await loadArmySchema()}
  <p>Loading army data...</p>
{:then { schema, items, regiments }}
  <BuilderContextProvider { schema } { items } { regiments }>
    <section class="flex justify-evenly items-start">
      <SchemaList />
      <ArmyInfo />
      <ArmyList />
    </section>
  </BuilderContextProvider>
{:catch error}
  <p>{ error.message }</p>
{/await}
