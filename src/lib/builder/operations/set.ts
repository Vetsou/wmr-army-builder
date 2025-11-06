import type { Writable } from 'svelte/store'

import * as UnitMutator from '../mutator/unit'
import * as ArmyMutator from '../mutator/army'


export const setUnitActions = (
  state: Writable<IBuilderState>
): Partial<IBuilderStore> => ({
  equipItem: (unitKey: string, itemKey: string, itemData: ISchemaMagicItem): void =>
    UnitMutator.equipItem(state, unitKey, itemKey, itemData),

  unequipItem: (unitKey: string, itemKey: string): void =>
    UnitMutator.unequipItem(state, unitKey, itemKey),

  equipUpgrade: (unitKey: string, upgradeKey: string, upgradeData: ISchemaUpgrade): void =>
    UnitMutator.equipUpgrade(state, unitKey, upgradeKey, upgradeData),

  unequipUpgrade: (unitKey: string, upgradeKey: string): void =>
    UnitMutator.unequipUpgrade(state, unitKey, upgradeKey),

  addStand: (unitKey: string, standKey: string, standData: ISchemaUnit): void =>
    UnitMutator.addStand(state, unitKey, standKey, standData),

  removeStand: (unitKey: string, standKey: string): void =>
    UnitMutator.removeStand(state, unitKey, standKey),
})

export const setArmyActions = (
  state: Writable<IBuilderState>
): Partial<IBuilderStore> => ({
  initNewArmy: (armySchema: IArmySchema, magicItems: Record<string, ISchemaMagicItem>): void =>
    ArmyMutator.resetState(state, armySchema, magicItems),

  addUnit: (unitKey: string, unitData: ISchemaUnit): void =>
    ArmyMutator.addUnit(state, unitKey, unitData, 1),

  removeUnit: (unitKey: string, unitData: IArmyUnit): void =>
    ArmyMutator.removeUnit(state, unitKey, unitData, 1),

  addRegiment: (
    unitKey: string,
    unitData: ISchemaRegiment,
    countAsData: IAddRegimentData
  ): void => ArmyMutator.addRegiment(state, unitKey, unitData, countAsData, 1),
})