import { writable } from 'svelte/store'

const _getRequiredUnits = (
  schemaUnits: Record<string, ISchemaUnit>
): [string, ISchemaUnit][] => {
  return Object.entries(schemaUnits)
    .filter(([_, ud]) => ud.min || ud.type === 'General')
}

const filterArmyRegiments = (
  regiments: Record<string, ISchemaRegiment>,
  armyName: string
): Record<string, ISchemaRegiment> => {
  return Object.fromEntries(
    Object.entries(regiments).filter(([_, regimentData]) => !regimentData.incompatibleFactions?.includes(armyName))
  )
}

export const createState = (
  armySchema: IArmySchema,
  items: Record<string, ISchemaMagicItem>,
  regiments: Record<string, ISchemaRegiment>
): IBuilderState => {
  const state = {
    armyName: armySchema.name,
    armyCost: writable(0),
    armyCostLimit: writable(2000),
    units: writable({}),
    armyErrors: writable([]),
    regimentCountAs: {
      units: Object.fromEntries(Object.keys(armySchema.units).map(name => [name, 0])),
      upgrades: Object.fromEntries(Object.keys(armySchema.upgrades ?? {}).map(name => [name, 0]))
    },
    lookup: {
      items: items,
      units: armySchema.units,
      regiments: filterArmyRegiments(regiments, armySchema.name),
      upgrades: armySchema.upgrades,
      stands: armySchema.stands
    }
  }

  return state
}