import type { IBuilderState } from '$builder/store'
import type { ArmyRule } from './rules'

import { isUnitCountIncorrect, isUpgradeCountIncorrect } from '$helper/unitLimits'
import { ArmyErrors, formatError } from './errorMessages'
import { validateUnit } from './unitRules'
import {
  getArmyItemCount,
  getArmyStandsCount,
  getArmyUpgradeCount
} from '$helper/armyHelper'

const armyRules: readonly ArmyRule[] = [
  {
    check(state) {
      return state.armyCost > state.armyCostLimit ? [ArmyErrors.ArmyCostExceedsLimit] : []
    }
  },
  {
    check(state) {
      const hasGeneral = Object.values(state.units).some(u => u.type === 'General')
      return hasGeneral === false ? [ArmyErrors.ArmyNeedsGeneral] : []
    }
  },
  {
    check(state) {
      const itemsCount = getArmyItemCount(state)
      return Object.entries(itemsCount)
        .filter(([_, count]) => count > 1)
        .map(([magicItemKey]) => formatError(ArmyErrors.DuplicateMagicItem, magicItemKey))
    }
  },
  {
    check(state) {
      const standsCount = getArmyStandsCount(state)
      return Object.entries(standsCount)
        .filter(([_, standData]) => isUnitCountIncorrect(standData, state.armyCost))
        .map(([standKey, standData]) => formatError(ArmyErrors.StandOutOfBounds, standData.count, standKey))
    }
  },
  {
    check(state) {
      const upgradeCount = getArmyUpgradeCount(state)
      return Object.entries(upgradeCount)
        .filter(([_, upgradeData]) => isUpgradeCountIncorrect(upgradeData, state.armyCost))
        .map(([upgradeKey, upgradeData]) =>
          formatError(ArmyErrors.UpgradeOutOfBounds, upgradeData.count, upgradeKey, upgradeData.armyMax ?? upgradeData.max ?? '-'))
    }
  }
]

export const validateArmy = (
  state: IBuilderState,
  prevArmyCost: number
) => {
  state.armyErrors = []

  const armyCrossedCostThreshold = Math.floor(state.armyCost / 1000) !== Math.floor(prevArmyCost / 1000)
  if (armyCrossedCostThreshold) {
    Object.keys(state.units).forEach(k => validateUnit(state, k))
  }

  state.armyErrors = armyRules.flatMap(r => r.check(state))
}