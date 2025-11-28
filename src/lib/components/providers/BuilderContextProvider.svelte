<script lang="ts">
  import { createBuilderContext } from '$lib/builder/store'
  import { setContext } from 'svelte'

  type Props = {
    schema: IArmySchema
    items: Record<string, ISchemaMagicItem>
    regiments: Record<string, ISchemaRegiment>
    children: any
  }

  let {
    schema,
    items,
    regiments,
    children
  }: Props = $props()

  setContext('BuilderState', createBuilderContext(schema, items, regiments))
</script>

{@render children?.()}