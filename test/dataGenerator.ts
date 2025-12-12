import { writable } from 'svelte/store'


interface IBuilderStatePartial {
  armyName?: string
  armyCost?: number
  armyCostLimit?: number
  units?: Record<string, IArmyUnit>
  armyErrors?: string[]
  regimentCountAs?: IRegimentCountAsData
  lookup?: ILookupData
}

export const createBuilderState = (
  partial: IBuilderStatePartial
): IBuilderState => {
  return {
    armyName: partial.armyName ?? 'Test Army',
    armyCost: writable(partial.armyCost ?? 0),
    armyCostLimit: writable(partial.armyCostLimit ?? 2000),
    units: writable({}),
    regimentCountAs: {
      units: partial.regimentCountAs?.units ?? {},
      upgrades: partial.regimentCountAs?.upgrades ?? {}
    },
    armyErrors: writable([]),
    lookup: {
      items: {},
      upgrades: {},
      stands: {},
      regiments: {},
      units: {}
    }
  }
}

export const createArmySchema = (
  schema: Partial<IArmySchema>
): IArmySchema => {
  return {
    name: schema.name ?? 'Test Army',
    units: schema.units ?? {},
    upgrades: schema.upgrades,
    stands: schema.stands
  }
}

export const createSchemaUnit = (
  unit: Partial<ISchemaUnit>
): ISchemaUnit => {
  return {
    id: unit.id ?? 'U1',
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

export const createArmyUnit = (
  unit: Partial<IArmyUnit>
): IArmyUnit => {
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

export const createRegimentSchema = (
  regiment: Partial<ISchemaRegiment>
): ISchemaRegiment => {
  const schemaUnit = createSchemaUnit({ ...regiment })
  return {
    ...schemaUnit,
    countAsRules: regiment.countAsRules,
    incompatibleFactions: regiment.incompatibleFactions,
    incompatibleWith: regiment.incompatibleWith,
  }
}

export const createSchemaItem = (
  item: Partial<ISchemaMagicItem>
): ISchemaMagicItem => {
  return {
    id: item.id ?? 'MI1',
    type: item.type ?? 'Magic Weapon',
    cost: item.cost ?? 100,
    allowedUnits: item.allowedUnits ?? ['Infantry'],
    stat: item.stat
  }
}

export const createSchemaUpgrade = (
  upgrade: Partial<ISchemaUpgrade>
): ISchemaUpgrade => {
  return {
    id: upgrade.id ?? 'UPG1',
    type: upgrade.type ?? 'Chariot Mount',
    cost: upgrade.cost ?? 25,
    max: upgrade.max,
    armyMax: upgrade.armyMax,
    attack: upgrade.attack,
    range: upgrade.range
  }
}