import type { UnitRulePayload } from '..'

import { formatError } from '$validator/internal'
import { UnitErrors } from '../messages'


const getUnitUpgradesCount = (
  unit: IArmyUnit
): number => Object.values(unit.equippedUpgrades).reduce((sum, upg) => sum + upg.count, 0)

export const unitHasTooManyUpgrades = (
  payload: UnitRulePayload,
  name: string
): string[] => {
  const armyUnit = payload.armyUnits[name]
  const unitUpgradesCount = getUnitUpgradesCount(armyUnit)
  return unitUpgradesCount > armyUnit.count
    ? [formatError(UnitErrors.tooManyUpgrades, armyUnit.count, name, unitUpgradesCount)] : []
}