import type { IBuilderState } from '$builder/store'
import type { UnitRule } from './rules'

import { isUnitCountIncorrect } from '$helper/unitLimits'
import { formatError, UnitErrors } from './errorMessages'
import {
  getUnitItemCount,
  getUnitStandsCount,
  getUnitUpgradesCount
} from '$helper/unitHelper'

const unitRules: readonly UnitRule[] = [
  {
    check(state, name) {
      const armyUnit = state.units[name]
      return isUnitCountIncorrect(armyUnit, state.armyCost)
        ? [formatError(UnitErrors.CountOutOfBounds, name, armyUnit.count)] : []
    }
  },
  {
    check(state, name) {
      const armyUnit = state.units[name]
      const unitItemCount = getUnitItemCount(armyUnit)
      return unitItemCount > armyUnit.count
        ? [formatError(UnitErrors.TooManyItems, armyUnit.count, name, unitItemCount)] : []
    }
  },
  {
    check(state, name) {
      const armyUnit = state.units[name]
      const unitUpgradesCount = getUnitUpgradesCount(armyUnit)
      return unitUpgradesCount > armyUnit.count
        ? [formatError(UnitErrors.TooManyUpgrades, armyUnit.count, name, unitUpgradesCount)] : []
    }
  },
  {
    check(state, name) {
      const armyUnit = state.units[name]
      const unitStandCount = getUnitStandsCount(armyUnit)
      return unitStandCount > armyUnit.count
        ? [formatError(UnitErrors.TooManyStands, armyUnit.count, name, unitStandCount)] : []
    }
  }
]

export const validateUnit = (
  state: IBuilderState,
  unitKey: string
) => {
  if (!state.units[unitKey]) return
  state.units[unitKey].errors = unitRules.flatMap(rule => rule.check(state, unitKey))
}