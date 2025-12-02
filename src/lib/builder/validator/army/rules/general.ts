import type { ArmyRulePayload } from '..'
import { ArmyErrors } from '../messages'


export const hasGeneral = (
  payload: ArmyRulePayload
): string[] => {
  const hasGeneral = Object.values(payload.armyUnits).some(u => u.type === 'General')
  return hasGeneral === false ? [ArmyErrors.armyNeedsGeneral] : []
}