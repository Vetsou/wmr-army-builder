import type { Writable } from 'svelte/store'
import { mutateArmy } from './internal'

import * as UnitValidator from '$validator/unit'
import * as ArmyValidator from '$validator/army'


export const addUnit = (
  builderState: Writable<IBuilderState>,
  unitKey: string,
  unitData: ISchemaUnit,
  count: number
): void => {
  mutateArmy(
    builderState, unitKey, unitData,
    (s, armyUnit: IArmyUnit) => {
      armyUnit.count += count
      s.armyCost += unitData.points * count
    }
  )
}

export const addRegiment = (
  builderState: Writable<IBuilderState>,
  unitKey: string,
  unitData: ISchemaRegiment,
  countAsData: { unitName?: string, upgradeName?: string },
  count: number
): void => {
  mutateArmy(
    builderState, unitKey, unitData,
    (s, armyRegiment: IArmyRegiment) => {
      const prevArmyCost = s.armyCost

      armyRegiment.count += count
      s.armyCost += unitData.points * count

      if (countAsData.unitName) {
        s.regimentCountAs.units[countAsData.unitName] += count
        UnitValidator.validateUnit(s, countAsData.unitName)
      }

      if (countAsData.upgradeName) {
        s.regimentCountAs.upgrades[countAsData.upgradeName] += count
        ArmyValidator.validateArmy(s, prevArmyCost)
      }
    }
  )
}