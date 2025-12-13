import * as UnitMutator from '../mutator/unit'
import * as ArmyMutator from '../mutator/army'
import { get } from 'svelte/store'


export const setUnitActions = (
  state: IBuilderState
): IUnitActions => ({
  equipItem: (unitKey: string, itemKey: string): void =>
    UnitMutator.equipItem(state, unitKey, itemKey, state.lookup.items[itemKey]),

  unequipItem: (unitKey: string, itemKey: string): void =>
    UnitMutator.unequipItem(state, unitKey, itemKey),

  equipUpgrade: (unitKey: string, upgradeKey: string): void =>
    UnitMutator.equipUpgrade(state, unitKey, upgradeKey, state.lookup.upgrades?.[upgradeKey]),

  unequipUpgrade: (unitKey: string, upgradeKey: string): void =>
    UnitMutator.unequipUpgrade(state, unitKey, upgradeKey),

  addStand: (unitKey: string, standKey: string): void =>
    UnitMutator.addStand(state, unitKey, standKey, state.lookup.stands?.[standKey]),

  removeStand: (unitKey: string, standKey: string): void =>
    UnitMutator.removeStand(state, unitKey, standKey),
})

export const setArmyActions = (
  state: IBuilderState
): IArmyActions => ({
  addUnit: (unitKey: string): void =>
    ArmyMutator.addUnit(state, unitKey, state.lookup.units[unitKey], 1),

  removeUnit: (unitKey: string): void =>
    ArmyMutator.removeUnit(state, unitKey, get(state.units)[unitKey], 1),

  addRegiment: (
    unitKey: string,
    countAsData: ICountAsRegimentData
  ): void => ArmyMutator.addRegiment(state, unitKey, state.lookup.regiments[unitKey], countAsData, 1),

  removeRegiment: (
    unitKey: string,
    countAsData: ICountAsRegimentData
  ): void => ArmyMutator.removeRegiment(state, unitKey, get(state.units)[unitKey], countAsData, 1)
})