import type { UnitRulePayload } from '..'

import { formatError } from '$validator/internal'
import { UnitErrors } from '../messages'


const getUnitStandsCount = (
  unit: IArmyUnit
): number => Object.values(unit.addedStands).reduce((sum, stand) => sum + stand.count, 0)

export const areStandsOutOfBounds = (
  payload: UnitRulePayload,
  name: string
): string[] => {
  const armyUnit = payload.armyUnits[name]
  const unitStandCount = getUnitStandsCount(armyUnit)
  return unitStandCount > armyUnit.count
    ? [formatError(UnitErrors.tooManyStands, armyUnit.count, name, unitStandCount)] : []
}