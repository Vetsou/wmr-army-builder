import type { ArmyRulePayload } from '..'
import { ArmyErrors } from '../messages'


export const isArmyCostExceedingLimit = (
  payload: ArmyRulePayload
): string[] => {
  return payload.armyCost > payload.armyCostLimit ? [ArmyErrors.armyCostExceedsLimit] : []
}