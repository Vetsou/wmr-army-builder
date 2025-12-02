import { get } from 'svelte/store'
import * as UnitRules from './rules'


export type UnitRulePayload = {
  armyName: string
  armyCost: number
  armyCostLimit: number
  regimentsCountAs: IRegimentCountAsData
  armyUnits: Record<string, IArmyUnit>
}

interface UnitRule {
  check(payload: UnitRulePayload, unitName: string): string[]
}

const unitRules: readonly UnitRule[] = [
  { check: UnitRules.areUnitsOutOfBounds },
  { check: UnitRules.unitHasTooManyItems },
  { check: UnitRules.unitHasTooManyUpgrades },
  { check: UnitRules.areStandsOutOfBounds }
]

export const validateUnit = (
  state: IBuilderState,
  unitKey: string
): void => {
  const payload: UnitRulePayload = {
    armyName: state.armyName,
    regimentsCountAs: state.regimentCountAs,
    armyCost: get(state.armyCost),
    armyCostLimit: get(state.armyCostLimit),
    armyUnits: get(state.units)
  }

  state.units.update(u => {
    if (!u[unitKey]) return u
    u[unitKey].errors = unitRules.flatMap(rule => rule.check(payload, unitKey))
    return u
  })
}