import type { Writable } from 'svelte/store'
import { isRegiment } from '$builder/types/guards'
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

      if (isRegiment(armyUnit)) {
        const armyRegiment = armyUnit as IArmyRegiment
        if (armyRegiment.countAsUnit) {
          s.regimentCountAs.units[armyRegiment.countAsUnit]--
          UnitValidator.validateUnit(s, armyRegiment.countAsUnit)
        }

        if (armyRegiment.countAsUpgrade) {
          s.regimentCountAs.upgrades[armyRegiment.countAsUpgrade]--
          UnitValidator.validateUnit(s, armyRegiment.countAsUpgrade)
        }
      }

      // Remove items and upgrades if unit is deleted
      if (armyUnit.count === 0) {
        s.armyCost -= getUnitAugmentsCost(armyUnit)
      }
    }
  )
}