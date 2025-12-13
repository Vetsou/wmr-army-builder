import { isRegiment } from '$lib/builder/types/guards'

import * as UnitValidator from '$validator/unit'
import * as ArmyValidator from '$validator/army'


export const getOrCreateUnit = (
  armyUnits: Record<string, IArmyUnit>,
  unitKey: string,
  unitData: ISchemaUnit,
): IArmyUnit => {
  let armyUnit = armyUnits[unitKey]

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
  }

  return armyUnit
}

export const postMutationValidate = (
  state: IBuilderState,
  unitKey: string,
  preMutationArmyCost: number
): void => {
  ArmyValidator.validateArmy(state, preMutationArmyCost)
  UnitValidator.validateUnit(state, unitKey)
}