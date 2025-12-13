import { getOrCreateUnit, postMutationValidate } from './internal'
import { get } from 'svelte/store'

import * as UnitValidator from '$validator/unit'


export const addUnit = (
  state: IBuilderState,
  unitKey: string,
  unitData: ISchemaUnit,
  count: number
): void => {
  const preMutationArmyCost = get(state.armyCost)
  const armyUnit = getOrCreateUnit(get(state.units), unitKey, unitData)

  armyUnit.count += count
  state.armyCost.set(preMutationArmyCost + unitData.points * count)

  state.units.update(units => (units[unitKey] = armyUnit, units))
  postMutationValidate(state, unitKey, preMutationArmyCost)
}

export const addRegiment = (
  state: IBuilderState,
  unitKey: string,
  unitData: ISchemaRegiment,
  countAsData: { unitName?: string, upgradeName?: string },
  count: number
): void => {
  const preMutationArmyCost = get(state.armyCost)
  const armyRegiment = getOrCreateUnit(get(state.units), unitKey, unitData) as IArmyRegiment

  armyRegiment.count += count
  state.armyCost.set(preMutationArmyCost + unitData.points * count)

  if (countAsData.unitName) {
    const unitName = countAsData.unitName

    armyRegiment.countAsUnits[unitName] =
      (armyRegiment.countAsUnits[unitName] ?? 0) + count

    state.regimentCountAs.units[unitName] += count
  }

  if (countAsData.upgradeName) {
    const upgradeName = countAsData.upgradeName

    armyRegiment.countAsUpgrades[upgradeName] =
      (armyRegiment.countAsUpgrades[upgradeName] ?? 0) + count

    state.regimentCountAs.upgrades[upgradeName] += count
  }

  state.units.update(units => (units[unitKey] = armyRegiment, units))

  // TODO: Make a single update
  postMutationValidate(state, unitKey, preMutationArmyCost)
  if (countAsData.unitName) UnitValidator.validateUnit(state, countAsData.unitName)
}