import type { Writable } from 'svelte/store'

import * as UnitValidator from '$validator/unit'
import * as ArmyValidator from '$validator/army'


type UnitMutationFn = (s: IBuilderState, unit: IArmyUnit) => void;

export const mutateUnit = (
  state: Writable<IBuilderState>,
  unitKey: string,
  mutationFunc: UnitMutationFn
): void => {
  state.update(s => {
    const armyUnit = s.units[unitKey]
    if (!armyUnit) return s

    const prevArmyCost = s.armyCost
    mutationFunc(s, armyUnit)

    UnitValidator.validateUnit(s, unitKey)
    ArmyValidator.validateArmy(s, prevArmyCost)

    return s
  })
}