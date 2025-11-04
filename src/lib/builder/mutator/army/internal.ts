import type { Writable } from 'svelte/store'

import * as UnitValidator from '$validator/unit'
import * as ArmyValidator from '$validator/army'


type UnitMutationFn = (s: IBuilderState, unit: IArmyUnit | IArmyRegiment) => void

export const mutateArmy = (
  builderState: Writable<IBuilderState>,
  unitKey: string,
  unitData: ISchemaUnit,
  mutationFunc: UnitMutationFn
): void => {
  builderState.update(s => {
    let armyUnit = s.units[unitKey]

    if (!armyUnit) {
      armyUnit = {
        ...unitData,
        count: 0,
        errors: [],
        equippedItems: {},
        equippedUpgrades: {},
        addedStands: {}
      }
      s.units[unitKey] = armyUnit
    }

    if (!armyUnit) return s
    const prevArmyCost = s.armyCost
    mutationFunc(s, armyUnit)

    if (armyUnit.count <= 0) delete s.units[unitKey]

    UnitValidator.validateUnit(s, unitKey)
    ArmyValidator.validateArmy(s, prevArmyCost)

    return s
  })
}