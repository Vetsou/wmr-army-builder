import { writable, get } from 'svelte/store'
import * as ArmyMutator from './mutator/armyMutator'
import * as UnitMutator from './mutator/unitMutator'

interface ILookupData {
  readonly magicItems: Record<string, ISchemaMagicItem>
  readonly armyUpgrades?: Record<string, ISchemaUpgrade>
  readonly armyStands?: Record<string, ISchemaUnit>
}

export interface IBuilderState {
  armyName: string
  armyCost: number
  armyCostLimit: number
  units: Record<string, IArmyUnit>
  armyErrors: string[]
  lookup: ILookupData
}

const createBuilderStore = () => {
  const state = writable<IBuilderState>({
    armyName: '',
    armyCost: 0,
    armyCostLimit: 2000,
    units: {},
    armyErrors: [],
    lookup: { magicItems: {}, armyUpgrades: {}, armyStands: {} }
  })

  return {
    subscribe: state.subscribe,
    getState: () => get(state),
    initNewArmy: (armySchema: IArmySchema, magicItems: Record<string, ISchemaMagicItem>) =>
      ArmyMutator.resetState(state, armySchema, magicItems),

    addUnit: (unitKey: string, unitData: ISchemaUnit) =>
      ArmyMutator.addUnit(state, unitKey, unitData, 1),
    removeUnit: (unitKey: string, unitData: IArmyUnit) =>
      ArmyMutator.removeUnit(state, unitKey, unitData, 1),

    equipItem: (unitKey: string, itemKey: string, itemData: ISchemaMagicItem) =>
      UnitMutator.equipItem(state, unitKey, itemKey, itemData),
    unequipItem: (unitKey: string, itemKey: string) =>
      UnitMutator.unequipItem(state, unitKey, itemKey),

    equipUpgrade: (unitKey: string, upgradeKey: string, upgradeData: ISchemaUpgrade) =>
      UnitMutator.equipUpgrade(state, unitKey, upgradeKey, upgradeData),
    unequipUpgrade: (unitKey: string, upgradeKey: string) =>
      UnitMutator.unequipUpgrade(state, unitKey, upgradeKey),

    addStand: (unitKey: string, standKey: string, standData: ISchemaUnit) =>
      UnitMutator.addStand(state, unitKey, standKey, standData),
    removeStand: (unitKey: string, standKey: string) =>
      UnitMutator.removeStand(state, unitKey, standKey),
  }
}

const BuilderStore = createBuilderStore()
export default BuilderStore