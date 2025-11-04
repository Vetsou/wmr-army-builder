import * as UnitRules from './rules'


interface UnitRule {
  check(state: IBuilderState, unitName: string): string[]
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
  if (!state.units[unitKey]) return
  state.units[unitKey].errors = unitRules.flatMap(rule => rule.check(state, unitKey))
}