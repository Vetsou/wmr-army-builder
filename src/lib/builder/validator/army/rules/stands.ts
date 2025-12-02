import type { ArmyRulePayload } from '..'

import { formatError, isUnitCountIncorrect } from '$validator/internal'
import { ArmyErrors } from '../messages'


const getArmyStandsCount = (
  payload: ArmyRulePayload
): Record<string, IArmyStand> => {
  const standCountMap: Record<string, IArmyStand> = {}

  for (const unit of Object.values(payload.armyUnits)) {
    for (const [standKey, stand] of Object.entries(unit.addedStands)) {
      if (!standCountMap[standKey]) {
        standCountMap[standKey] = { ...stand, count: 0 }
      }

      standCountMap[standKey].count += stand.count
    }
  }

  return standCountMap
}

export const areStandsOutOfBounds = (
  payload: ArmyRulePayload
): string[] => {
  const standsCount = getArmyStandsCount(payload)
  return Object.entries(standsCount)
    .filter(([_, standData]) => isUnitCountIncorrect(standData, 0, payload.armyCost))
    .map(([standKey, standData]) => formatError(ArmyErrors.standOutOfBounds, standData.count, standKey))
}