import type { Writable } from 'svelte/store'
import { mutateArmy } from './internal'

import * as UnitValidator from '$builder/validator/unit'


export const addUnit = (
  builderState: Writable<IBuilderState>,
  unitKey: string,
  unitData: ISchemaUnit,
  count: number
) => {
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
) => {
  mutateArmy(
    builderState, unitKey, unitData,
    (s, armyRegiment: IArmyRegiment) => {
      armyRegiment.count += count
      s.armyCost += unitData.points * count

      if (countAsData.unitName) {
        s.regimentCountAs.units[countAsData.unitName]++
        UnitValidator.validateUnit(s, countAsData.unitName)
      }

      if (countAsData.upgradeName) {
        s.regimentCountAs.upgrades[countAsData.upgradeName]++
        UnitValidator.validateUnit(s, countAsData.upgradeName)
      }

      armyRegiment.countAsUnit = countAsData.unitName
      armyRegiment.countAsUpgrade = countAsData.upgradeName
    }
  )
}