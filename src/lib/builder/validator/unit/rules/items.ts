import type { UnitRulePayload } from '..'

import { formatError } from '$validator/internal'
import { UnitErrors } from '../messages'


const getUnitItemCount = (
  unit: IArmyUnit
): number => Object.values(unit.equippedItems).reduce((sum, item) => sum + item.count, 0)

export const unitHasTooManyItems = (
  payload: UnitRulePayload,
  name: string
): string[] => {
  const armyUnit = payload.armyUnits[name]
  const unitItemCount = getUnitItemCount(armyUnit)
  return unitItemCount > armyUnit.count
    ? [formatError(UnitErrors.tooManyItems, armyUnit.count, name, unitItemCount)] : []
}