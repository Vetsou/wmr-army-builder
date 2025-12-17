import { getOrCreateUnit, postMutationValidate } from './internal'
import { get } from 'svelte/store'

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
  state: IBuilderState,
  unitKey: string,
  unitData: IArmyUnit,
  count: number
): void => {
  const preMutationArmyCost = get(state.armyCost)

  state.units.update(u => {
    const armyUnit = getOrCreateUnit(u, unitKey, unitData)
    armyUnit.count -= count

    // Update army cost
    state.armyCost.update(ac => {
      ac -= unitData.points * count

      if (armyUnit.count <= 0) {
        ac -= getUnitAugmentsCost(armyUnit)
        delete u[unitKey]
      }

      return ac
    })

    return u
  })

  postMutationValidate(state, unitKey, preMutationArmyCost)
}

export const removeRegiment = (
  state: IBuilderState,
  unitKey: string,
  unitData: ISchemaRegiment,
  countAsData: { unitName?: string, upgradeName?: string },
  count: number
): void => {
  const preMutationArmyCost = get(state.armyCost)
  const armyRegiment = getOrCreateUnit(get(state.units), unitKey, unitData) as IArmyRegiment

  if (countAsData.unitName) {
    const unitName = countAsData.unitName

    armyRegiment.countAsUnits[unitName] -= count
    state.regimentCountAs.units[unitName] -= count
  }

  if (countAsData.upgradeName) {
    const upgradeName = countAsData.upgradeName

    armyRegiment.countAsUpgrades[upgradeName] -= count
    state.regimentCountAs.upgrades[upgradeName] -= count
  }

  state.armyCost.set(preMutationArmyCost - unitData.points * count)
  state.units.update(u => {
    u[unitKey].count -= count
    if (u[unitKey].count <= 0) delete u[unitKey]
    return u
  })

  // Regiments don't have items/upgrades/stands

  // Make it a single update
  if (countAsData.unitName) UnitValidator.validateUnit(state, countAsData.unitName)
  postMutationValidate(state, unitKey, preMutationArmyCost)
}