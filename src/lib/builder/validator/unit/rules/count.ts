import type { UnitRulePayload } from '..'

import { isRegiment } from '$builder/types/guards'
import { formatError, isUnitCountIncorrect } from '$validator/internal'
import { UnitErrors } from '../messages'


export const areUnitsOutOfBounds = (
  payload: UnitRulePayload,
  name: string
): string[] => {
  const armyUnit = payload.armyUnits[name]
  const takenByRegiment = isRegiment(armyUnit) ? 0 : payload.regimentsCountAs.units[name]
  const unitCount = armyUnit.count + takenByRegiment

  return isUnitCountIncorrect(armyUnit, takenByRegiment, payload.armyCost)
    ? [formatError(UnitErrors.countOutOfBounds, name, unitCount)] : []
}