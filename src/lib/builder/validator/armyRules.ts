import type { IBuilderState } from '$builder/store'
import type { ArmyRule } from './rules'

import { isUnitCountIncorrect, isUpgradeCountIncorrect } from '$helper/unitLimits'
import { ArmyErrors, formatError } from './errorMessages'
import { isRegiment } from '$helper/typeGuards'
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
        .filter(([_, standData]) => isUnitCountIncorrect(standData, 0, state.armyCost))
        .map(([standKey, standData]) => formatError(ArmyErrors.StandOutOfBounds, standData.count, standKey))
    }
  },
  {
    check(state) {
      const upgradeCount = getArmyUpgradeCount(state)
      return Object.entries(upgradeCount)
        .filter(([upgradeKey, upgradeData]) =>
          isUpgradeCountIncorrect(upgradeData, state.regimentCountAs.upgrades[upgradeKey], state.armyCost))
        .map(([upgradeKey, upgradeData]) =>
          formatError(
            ArmyErrors.UpgradeOutOfBounds,
            upgradeData.count + state.regimentCountAs.upgrades[upgradeKey],
            upgradeKey, upgradeData.armyMax ?? upgradeData.max ?? '-'
          ))
    }
  },
  {
    check(state) {
      const regiments = new Map<string, IArmyRegiment>()
      const errors: string[] = []

      for (const [name, unit] of Object.entries(state.units)) {
        if (isRegiment(unit)) regiments.set(name, unit)
      }

      for (const [name, regiment] of regiments) {
        const incompatibleUnits = regiment.incompatibleWith
        if (!incompatibleUnits) continue

        for (const badUnitName of incompatibleUnits) {
          if (badUnitName.startsWith('(')) {
            const endIdx = badUnitName.indexOf(')')

            if (endIdx !== -1) {
              const armyName = badUnitName.slice(1, endIdx).trim()
              const unitName = badUnitName.slice(endIdx + 1).trim()

              if (state.armyName === armyName && state.units[unitName]) {
                errors.push(formatError(ArmyErrors.IncompatibleRegiments, name, unitName))
              }

              continue // Skip standard check
            }
          }

          if (regiments.has(badUnitName)) {
            errors.push(formatError(ArmyErrors.IncompatibleRegiments, name, badUnitName))
          }
        }
      }

      return errors
    }
  },
  {
    check(state) {
      const regimentLimit = Math.ceil(state.armyCost / 1000)
      const totalRegiments = Object.values(state.units)
        .filter(u => isRegiment(u))
        .reduce((sum, regiment) => sum + regiment.count, 0)

      return totalRegiments > regimentLimit ?
        [formatError(ArmyErrors.TooManyRegiments, totalRegiments, regimentLimit)] : []
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