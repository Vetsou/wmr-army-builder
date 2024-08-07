import type { IBaseUnit, IBuilderUnit } from '$types/schema'
import type { Writable } from 'svelte/store'
import type { IBuilderState } from './store'

import * as Validator from './validator'

const removeUnitItems =
(state: IBuilderState, unit: IBuilderUnit): number => {
  const itemsCost = unit.equippedItems.reduce((sum, mi) => (state.validation.magicItems[mi.name]--, sum + mi.points), 0)
  const upgradeCost = unit.equippedUpgrades.reduce((sum, upg) => (state.validation.armyUpgrades[upg.name]--, sum + upg.pointsModify), 0)

  return itemsCost + upgradeCost
}

const createNewBuilderUnit =
(unitData: IBaseUnit, unitCount: number): IBuilderUnit => {
  return {
    ...unitData,
    count: unitCount,
    errors: [],
    equippedItems: [],
    equippedUpgrades: []
  }
}

export const addUnit =
(state: Writable<IBuilderState>, unit: IBaseUnit, count: number) => {
  state.update(s => {
    const unitIdx = s.units.findIndex(builderUnit => unit.id === builderUnit.id)
    const isNewUnit = unitIdx === -1
    
    let unitBuffer: IBuilderUnit
    
    if (isNewUnit) {
      unitBuffer = createNewBuilderUnit(unit, count)
      s.units.push(unitBuffer)
    } else {
      unitBuffer = s.units[unitIdx]
      unitBuffer.count += count
    }

    const prevArmyCost = s.armyCost
    s.armyCost += unit.points * count

    Validator.validateUnit(unitBuffer, s.armyCost)
    Validator.validateArmy(s, prevArmyCost)
    return s
  })
}

export const removeUnit =
(state: Writable<IBuilderState>, unit: IBaseUnit, count: number) => {
  state.update(s => {
    const unitIdx = s.units.findIndex(builderUnit => unit.id === builderUnit.id)
    const isDeleted = s.units[unitIdx].count - count <= 0
    const prevArmyCost = s.armyCost

    if (isDeleted) {
      const deletedUnit = s.units.splice(unitIdx, 1)[0]
      const removedItemsCost = removeUnitItems(s, deletedUnit)
      s.armyCost -= deletedUnit.count * deletedUnit.points + removedItemsCost
    } else {
      const builderUnit = s.units[unitIdx]
      builderUnit.count -= count
      s.armyCost -= unit.points * count
      Validator.validateUnit(builderUnit, s.armyCost)
    }

    Validator.validateArmy(s, prevArmyCost)
    return s
  })
}