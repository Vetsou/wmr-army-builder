import type { Writable } from 'svelte/store'
import { isRegiment } from '$lib/builder/types/guards'

import * as UnitValidator from '$validator/unit'
import * as ArmyValidator from '$validator/army'


type UnitMutationFn<T extends IArmyUnit | IArmyRegiment> = (
  s: IBuilderState,
  unit: T
) => void

export const mutateArmy = <T extends IArmyUnit | IArmyRegiment>(
  builderState: Writable<IBuilderState>,
  unitKey: string,
  unitData: ISchemaUnit,
  mutationFunc: UnitMutationFn<T>
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

      // Init regiment specific fields
      if (isRegiment(armyUnit)) {
        armyUnit.countAsUnits = {}
        armyUnit.countAsUpgrades = {}
      }

      s.units[unitKey] = armyUnit
    }

    if (!armyUnit) return s
    const prevArmyCost = s.armyCost
    mutationFunc(s, armyUnit as T)

    if (armyUnit.count <= 0) delete s.units[unitKey]

    UnitValidator.validateUnit(s, unitKey)
    ArmyValidator.validateArmy(s, prevArmyCost)

    return s
  })
}