import type { Writable } from 'svelte/store'
import type { IBuilderState } from '$builder/store'
import { getUnitItemCost } from '$helper/unitHelper'

import * as UnitValidator from '$builder/validator/unitRules'
import * as ArmyValidator from '$builder/validator/armyRules'

type UnitMutationFn = (s: IBuilderState, unit: IArmyUnit) => void;

const mutateUnit = (
  state: Writable<IBuilderState>,
  unitKey: string,
  mutationFunc: UnitMutationFn
) => {
  state.update(s => {
    const armyUnit = s.units[unitKey]
    if (!armyUnit) return s

    const prevArmyCost = s.armyCost
    mutationFunc(s, armyUnit)

    UnitValidator.validateUnit(s, unitKey)
    ArmyValidator.validateArmy(s, prevArmyCost)

    return s
  })
}

export const equipItem = (
  state: Writable<IBuilderState>,
  unitKey: string,
  itemKey: string,
  itemData: ISchemaMagicItem
) => {
  mutateUnit(state, unitKey, (s, unit) => {
    const costForUnit = getUnitItemCost(unit, itemData)

    let unitItem = unit.equippedItems[itemKey]
    if (!unitItem) {
      unitItem = { ...itemData, costForUnit, count: 0 }
      unit.equippedItems[itemKey] = unitItem
    }

    unitItem.count++
    s.armyCost += costForUnit
  })
}

export const unequipItem = (
  state: Writable<IBuilderState>,
  unitKey: string,
  itemKey: string,
  itemData: ISchemaMagicItem
) => {
  mutateUnit(state, unitKey, (s, unit) => {
    const unitItem = unit.equippedItems[itemKey]

    const costForUnit = getUnitItemCost(unit, itemData)
    unitItem.count--
    s.armyCost -= costForUnit

    if (unitItem.count <= 0) delete unit.equippedItems[itemKey]
  })
}

export const equipUpgrade = (
  state: Writable<IBuilderState>,
  unitKey: string,
  upgradeKey: string,
  upgradeData: ISchemaUpgrade
) => {
  mutateUnit(state, unitKey, (s, unit) => {
    let unitUpgrade = unit.equippedUpgrades[upgradeKey]

    if (!unitUpgrade) {
      unitUpgrade = { ...upgradeData, count: 0 }
      unit.equippedUpgrades[upgradeKey] = unitUpgrade
    }

    unitUpgrade.count++
    s.armyCost += upgradeData.cost
  })
}

export const unequipUpgrade = (
  state: Writable<IBuilderState>,
  unitKey: string,
  upgradeKey: string
) => {
  mutateUnit(state, unitKey, (s, unit) => {
    const unitUpgrade = unit.equippedUpgrades[upgradeKey]
    if (!unitUpgrade) return

    unitUpgrade.count--
    s.armyCost -= unitUpgrade.cost

    if (unitUpgrade.count <= 0) {
      delete unit.equippedUpgrades[upgradeKey]
    }
  })
}

export const addStand = (
  state: Writable<IBuilderState>,
  unitKey: string,
  standKey: string,
  standData: ISchemaUnit
) => {
  mutateUnit(state, unitKey, (s, unit) => {
    let unitStand = unit.addedStands[standKey]

    if (!unitStand) {
      unitStand = { ...standData, count: 0 }
      unit.addedStands[standKey] = unitStand
    }

    unitStand.count++
    s.armyCost += unitStand.points
  })
}

export const removeStand = (
  state: Writable<IBuilderState>,
  unitKey: string,
  standKey: string
) => {
  mutateUnit(state, unitKey, (s, unit) => {
    const unitStand = unit.addedStands[standKey]
    if (!unitStand) return

    unitStand.count--
    s.armyCost -= unitStand.points

    if (unitStand.count <= 0) {
      delete unit.addedStands[standKey]
    }
  })
}