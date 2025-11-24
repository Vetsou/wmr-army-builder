import type { Writable } from 'svelte/store'
import { mutateArmy } from './internal'

import * as UnitValidator from '$validator/unit'


const getUnitAugmentsCost = (
  unitData: IArmyUnit
): number => {
  const itemsCost = Object.values(unitData.equippedItems).reduce((sum, mi) => sum + (mi.costForUnit * mi.count), 0)
  const upgradesCost = Object.values(unitData.equippedUpgrades).reduce((sum, upg) => sum + (upg.cost * upg.count), 0)
  const standsCost = Object.values(unitData.addedStands).reduce((sum, stand) => sum + (stand.points * stand.count), 0)

  return itemsCost + upgradesCost + standsCost
}

export const removeUnit = (
  builderState: Writable<IBuilderState>,
  unitKey: string,
  unitData: IArmyUnit,
  count: number
): void => {
  mutateArmy(
    builderState, unitKey, unitData,
    (s, armyUnit: IArmyUnit) => {
      armyUnit.count -= count
      s.armyCost -= unitData.points * count

      // Remove items and upgrades if unit is deleted
      if (armyUnit.count === 0) {
        s.armyCost -= getUnitAugmentsCost(armyUnit)
      }
    }
  )
}

export const removeRegiment = (
  builderState: Writable<IBuilderState>,
  unitKey: string,
  unitData: IArmyRegiment,
  countAsData: { unitName?: string, upgradeName?: string },
  count: number
): void => {
  mutateArmy(
    builderState, unitKey, unitData,
    (s, armyUnit: IArmyUnit) => {
      armyUnit.count -= count
      s.armyCost -= unitData.points * count

      if (countAsData.unitName) {
        s.regimentCountAs.units[countAsData.unitName] -= count
        UnitValidator.validateUnit(s, countAsData.unitName)
      }

      if (countAsData.upgradeName) {
        s.regimentCountAs.upgrades[countAsData.upgradeName] -= count
        UnitValidator.validateUnit(s, countAsData.upgradeName)
      }

      // Regiments don't have items/upgrades/stands
    }
  )
}