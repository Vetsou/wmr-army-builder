import { get, type Writable } from 'svelte/store'

import * as UnitMutator from '../mutator/unit'
import * as ArmyMutator from '../mutator/army'


export const setUnitActions = (
  state: Writable<IBuilderState>
): IUnitActions => ({
  equipItem: (unitKey: string, itemKey: string): void =>
    UnitMutator.equipItem(state, unitKey, itemKey, get(state).lookup.items[itemKey]),

  unequipItem: (unitKey: string, itemKey: string): void =>
    UnitMutator.unequipItem(state, unitKey, itemKey),

  equipUpgrade: (unitKey: string, upgradeKey: string): void =>
    UnitMutator.equipUpgrade(state, unitKey, upgradeKey, get(state).lookup.upgrades?.[upgradeKey]),

  unequipUpgrade: (unitKey: string, upgradeKey: string): void =>
    UnitMutator.unequipUpgrade(state, unitKey, upgradeKey),

  addStand: (unitKey: string, standKey: string): void =>
    UnitMutator.addStand(state, unitKey, standKey, get(state).lookup.stands?.[standKey]),

  removeStand: (unitKey: string, standKey: string): void =>
    UnitMutator.removeStand(state, unitKey, standKey),
})

export const setArmyActions = (
  state: Writable<IBuilderState>
): IArmyActions => ({
  initNewArmy: (
    armySchema: IArmySchema,
    magicItems: Record<string, ISchemaMagicItem>,
    regiments: Record<string, ISchemaRegiment>
  ): void => ArmyMutator.resetState(state, armySchema, magicItems, regiments),

  addUnit: (unitKey: string): void =>
    ArmyMutator.addUnit(state, unitKey, get(state).lookup.units[unitKey], 1),

  removeUnit: (unitKey: string): void =>
    ArmyMutator.removeUnit(state, unitKey, get(state).units[unitKey], 1),

  addRegiment: (
    unitKey: string,
    countAsData: ICountAsRegimentData
  ): void => ArmyMutator.addRegiment(state, unitKey, get(state).lookup.regiments[unitKey], countAsData, 1),

  removeRegiment: (
    unitKey: string,
    countAsData: ICountAsRegimentData
  ): void => ArmyMutator.removeRegiment(state, unitKey, get(state).units[unitKey], countAsData, 1)
})