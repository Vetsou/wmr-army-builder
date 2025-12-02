import type { Writable } from 'svelte/store'
import { getOrCreateUnit, postMutationValidate } from './internal'

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
  state: Writable<IBuilderState>,
  unitKey: string,
  unitData: IArmyUnit,
  count: number
): void => {
  state.update(s => {
    const preMutationArmyCost = s.armyCost
    const armyUnit = getOrCreateUnit(s.units, unitKey, unitData)

    armyUnit.count -= count

    s.armyCost -= unitData.points * count
    if (armyUnit.count <= 0) {
      s.armyCost -= getUnitAugmentsCost(armyUnit)
      delete s.units[unitKey]
    }

    postMutationValidate(s, unitKey, preMutationArmyCost)
    return s
  })
}

export const removeRegiment = (
  state: Writable<IBuilderState>,
  unitKey: string,
  unitData: ISchemaRegiment,
  countAsData: { unitName?: string, upgradeName?: string },
  count: number
): void => {
  state.update(s => {
    const preMutationArmyCost = s.armyCost
    const armyRegiment = getOrCreateUnit(s.units, unitKey, unitData) as IArmyRegiment

    armyRegiment.count -= count
    s.armyCost = preMutationArmyCost - unitData.points * count

    if (countAsData.unitName) {
      const unitName = countAsData.unitName

      armyRegiment.countAsUnits[unitName] -= count
      s.regimentCountAs.units[unitName] -= count
    }

    if (countAsData.upgradeName) {
      const upgradeName = countAsData.upgradeName

      armyRegiment.countAsUpgrades[upgradeName] -= count
      s.regimentCountAs.upgrades[upgradeName] -= count
    }

    // Regiments don't have items/upgrades/stands

    // Make it a single update
    if (countAsData.unitName) UnitValidator.validateUnit(s, countAsData.unitName)
    postMutationValidate(s, unitKey, preMutationArmyCost)

    return s
  })
}