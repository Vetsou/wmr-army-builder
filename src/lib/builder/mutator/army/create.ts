import { writable, type Writable } from 'svelte/store'
import { addUnit } from './add'


const addRequiredUnits = (
  state: Writable<IBuilderState>,
  armySchema: IArmySchema
): void => {
  Object.entries(armySchema.units).forEach(([unitKey, schemaUnit]) => {
    if (schemaUnit.min) {
      addUnit(state, unitKey, schemaUnit, schemaUnit.min)
      return
    }

    if (schemaUnit.type === 'General') addUnit(state, unitKey, schemaUnit, 1)
  })
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
): Writable<IBuilderState> => {
  const state = writable({
    armyName: armySchema.name,
    armyCost: 0,
    armyCostLimit: 2000,
    units: {},
    armyErrors: [],
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
  })

  addRequiredUnits(state, armySchema)
  return state
}