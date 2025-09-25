import type { IBuilderState } from "$builder/store"
import { writable, type Writable } from "svelte/store"

export const createBuilderState = (): Writable<IBuilderState> => {
  return writable<IBuilderState>({
    armyName: 'Test Army',
    armyCost: 0,
    armyCostLimit: 2000,
    units: {},
    armyErrors: [],
    lookup: {
      magicItems: {},
      armyUpgrades: {},
      armyStands: {}
    }
  })
}

export const createArmySchema = (schema: Partial<IArmySchema>): IArmySchema => {
  return {
    name: schema.name ?? 'Test Army',
    units: schema.units ?? {},
    upgrades: schema.upgrades,
    stands: schema.stands
  }
}

export const createSchemaUnit = (unit: Partial<ISchemaUnit>): ISchemaUnit => {
  return {
    attack: unit.attack ?? '2',
    max: unit.max,
    min: unit.min,
    armyMax: unit.armyMax,
    points: unit.points ?? 100,
    size: unit.size ?? 3,
    type: unit.type ?? 'Infantry',
    upgrades: unit.upgrades ?? [],
    customItems: unit.customItems ?? [],
    extraStands: unit.extraStands ?? []
  } 
}

export const createArmyUnit = (unit: Partial<IArmyUnit>): IArmyUnit => {
  const schemaUnit = createSchemaUnit({ ...unit })
  return {
    ...schemaUnit,
    count: unit.count ?? 1,
    errors: unit.errors ?? [],
    equippedItems: unit.equippedItems ?? {},
    addedStands: unit.addedStands ?? {},
    equippedUpgrades: unit.equippedUpgrades ?? {}
  }
}