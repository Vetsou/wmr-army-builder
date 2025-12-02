import type { Writable } from 'svelte/store'
import { getOrCreateUnit, postMutationValidate } from './internal'

import * as UnitValidator from '$validator/unit'


export const addUnit = (
  state: Writable<IBuilderState>,
  unitKey: string,
  unitData: ISchemaUnit,
  count: number
): void => {
  state.update(s => {
    const preMutationArmyCost = s.armyCost
    const armyUnit = getOrCreateUnit(s.units, unitKey, unitData)

    armyUnit.count += count
    s.armyCost = preMutationArmyCost + unitData.points * count

    postMutationValidate(s, unitKey, preMutationArmyCost)
    return s
  })
}

export const addRegiment = (
  state: Writable<IBuilderState>,
  unitKey: string,
  unitData: ISchemaRegiment,
  countAsData: { unitName?: string, upgradeName?: string },
  count: number
): void => {
  state.update(s => {
    const preMutationArmyCost = s.armyCost
    const armyRegiment = getOrCreateUnit(s.units, unitKey, unitData) as IArmyRegiment

    armyRegiment.count += count
    s.armyCost = preMutationArmyCost + unitData.points * count

    if (countAsData.unitName) {
      const unitName = countAsData.unitName

      armyRegiment.countAsUnits[unitName] =
        (armyRegiment.countAsUnits[unitName] ?? 0) + count

      s.regimentCountAs.units[unitName] += count
    }

    if (countAsData.upgradeName) {
      const upgradeName = countAsData.upgradeName

      armyRegiment.countAsUpgrades[upgradeName] =
        (armyRegiment.countAsUpgrades[upgradeName] ?? 0) + count

      s.regimentCountAs.upgrades[upgradeName] += count
    }

    // TODO: Make a single update
    if (countAsData.unitName) UnitValidator.validateUnit(s, countAsData.unitName)
    postMutationValidate(s, unitKey, preMutationArmyCost)

    return s
  })
}