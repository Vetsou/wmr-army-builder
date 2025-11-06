import { validateUnit } from '../unit'
import * as ArmyRules from './rules'


interface ArmyRule {
  check(state: IBuilderState): string[]
}

const armyRules: readonly ArmyRule[] = [
  { check: ArmyRules.isArmyCostExceedingLimit },
  { check: ArmyRules.hasGeneral },
  { check: ArmyRules.hasDuplicateMagicItem },
  { check: ArmyRules.isArmyUpgradeCountCorrect },
  { check: ArmyRules.hasIncompatibleRegiments },
  { check: ArmyRules.areStandsOutOfBounds }
]

export const validateArmy = (
  state: IBuilderState,
  prevArmyCost: number
): void => {
  state.armyErrors = []

  const armyCrossedCostThreshold = Math.floor(state.armyCost / 1000) !== Math.floor(prevArmyCost / 1000)
  if (armyCrossedCostThreshold) {
    Object.keys(state.units).forEach(k => validateUnit(state, k))
  }

  state.armyErrors = armyRules.flatMap(r => r.check(state))
}