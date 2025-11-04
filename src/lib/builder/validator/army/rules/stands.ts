import { formatError, isUnitCountIncorrect } from '$validator/internal'
import { ArmyErrors } from '../messages'

const getArmyStandsCount = (
  state: IBuilderState
): Record<string, IArmyStand> => {
  const standCountMap: Record<string, IArmyStand> = {}

  for (const unit of Object.values(state.units)) {
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
  state: IBuilderState
): string[] => {
  const standsCount = getArmyStandsCount(state)
  return Object.entries(standsCount)
    .filter(([_, standData]) => isUnitCountIncorrect(standData, 0, state.armyCost))
    .map(([standKey, standData]) => formatError(ArmyErrors.StandOutOfBounds, standData.count, standKey))
}