<script lang="ts">
  import type { RouteResult } from '@mateothegreat/svelte5-router'
  import { fetchPublicData } from './io'

  import BuilderContextProvider from '$components/providers/BuilderContextProvider.svelte'

  import ArmyList from '$components/ArmyList.svelte'
  import SchemaList from '$components/SchemaList.svelte'
  import ArmyInfo from '$components/ArmyInfo.svelte'


  type ArmySchemaData = {
    schema: IArmySchema
    items: Record<string, ISchemaMagicItem>
    regiments: Record<string, ISchemaRegiment>
  }

  type Props = {
    route: RouteResult
  }

  const { route }: Props = $props()

  const loadArmySchema = async (): Promise<ArmySchemaData> => {
    const urlPathParams = route.result.path.params as Record<string, string>
    const factionFile = urlPathParams.name

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
  <BuilderContextProvider { schema } { items } { regiments } { route }>
    <section class="flex justify-evenly items-start">
      <SchemaList />
      <ArmyInfo />
      <ArmyList />
    </section>
  </BuilderContextProvider>
{:catch error}
  <p>{ error.message }</p>
{/await}
