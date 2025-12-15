<script lang="ts">
  import type { RouteResult } from '@mateothegreat/svelte5-router'
  import { createBuilderContext } from '$lib/builder/store'
  import { setContext } from 'svelte'


  type Props = {
    schema: IArmySchema
    items: Record<string, ISchemaMagicItem>
    regiments: Record<string, ISchemaRegiment>
    route: RouteResult
    children: any
  }

  let {
    schema,
    items,
    regiments,
    children,
    route
  }: Props = $props()

  setContext('BuilderState', createBuilderContext(
    schema,
    items,
    regiments,
    route.result.querystring.params as Record<string, string>
  ))
</script>

{@render children?.()}