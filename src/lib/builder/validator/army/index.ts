import { get } from 'svelte/store'
import { validateUnit } from '../unit'

import * as ArmyRules from './rules'


export type ArmyRulePayload = {
  armyName: string
  armyCost: number
  armyCostLimit: number
  regimentsCountAs: IRegimentCountAsData
  armyUnits: Record<string, IArmyUnit>
}

interface ArmyRule {
  check(payload: ArmyRulePayload): string[]
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
  const payload: ArmyRulePayload = {
    armyName: state.armyName,
    regimentsCountAs: state.regimentCountAs,
    armyCost: get(state.armyCost),
    armyCostLimit: get(state.armyCostLimit),
    armyUnits: get(state.units)
  }

  const armyCrossedCostThreshold = Math.floor(payload.armyCost / 1000) !== Math.floor(prevArmyCost / 1000)
  if (armyCrossedCostThreshold) {
    Object.keys(payload.armyUnits).forEach(k => validateUnit(state, k))
  }

  state.armyErrors.set(armyRules.flatMap(r => r.check(payload)))
}