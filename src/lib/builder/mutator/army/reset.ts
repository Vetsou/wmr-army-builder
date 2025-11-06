import type { Writable } from 'svelte/store'
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

export const resetState = (
  state: Writable<IBuilderState>,
  armySchema: IArmySchema,
  magicItems: Record<string, ISchemaMagicItem>
): void => {
  state.set({
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
      magicItems: magicItems,
      armyUpgrades: armySchema.upgrades,
      armyStands: armySchema.stands
    }
  })

  addRequiredUnits(state, armySchema)
}