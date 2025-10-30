import type { Writable } from 'svelte/store'
import type { IBuilderState } from '$builder/store'
import { isRegiment } from '$builder/helper/typeGuards'

import * as UnitValidator from '$builder/validator/unitRules'
import * as ArmyValidator from '$builder/validator/armyRules'

type UnitMutationFn = (s: IBuilderState, unit: IArmyUnit | IArmyRegiment) => void

const mutateUnit = (
  builderState: Writable<IBuilderState>,
  unitKey: string,
  unitData: ISchemaUnit,
  mutationFunc: UnitMutationFn
) => {
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

    if (armyUnit.count <= 0) {
      delete s.units[unitKey]
    }

    UnitValidator.validateUnit(s, unitKey)
    ArmyValidator.validateArmy(s, prevArmyCost)

    return s
  })
}

const getUnitAugmentsCost = (
  unitData: IArmyUnit
): number => {
  const itemsCost = Object.values(unitData.equippedItems).reduce((sum, mi) => sum + (mi.costForUnit * mi.count), 0)
  const upgradesCost = Object.values(unitData.equippedUpgrades).reduce((sum, upg) => sum + (upg.cost * upg.count), 0)
  const standsCost = Object.values(unitData.addedStands).reduce((sum, stand) => sum + (stand.points * stand.count), 0)

  return itemsCost + upgradesCost + standsCost
}

export const addUnit = (
  builderState: Writable<IBuilderState>,
  unitKey: string,
  unitData: ISchemaUnit,
  count: number
) => {
  mutateUnit(
    builderState, unitKey, unitData,
    (s, armyUnit: IArmyUnit) => {
      armyUnit.count += count
      s.armyCost += unitData.points * count
    }
  )
}

export const removeUnit = (
  builderState: Writable<IBuilderState>,
  unitKey: string,
  unitData: IArmyUnit,
  count: number
) => {
  mutateUnit(
    builderState, unitKey, unitData,
    (s, armyUnit: IArmyUnit) => {
      armyUnit.count -= count
      s.armyCost -= unitData.points * count

      if (isRegiment(armyUnit)) {
        const armyRegiment = armyUnit as IArmyRegiment
        if (armyRegiment.countAsUnit) {
          s.regimentCountAs.units[armyRegiment.countAsUnit]--
          UnitValidator.validateUnit(s, armyRegiment.countAsUnit)
        }

        if (armyRegiment.countAsUpgrade) {
          s.regimentCountAs.upgrades[armyRegiment.countAsUpgrade]--
          UnitValidator.validateUnit(s, armyRegiment.countAsUpgrade)
        }
      }

      // Remove items and upgrades if unit is deleted
      if (armyUnit.count === 0) {
        s.armyCost -= getUnitAugmentsCost(armyUnit)
      }
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
  mutateUnit(
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

const addRequiredUnits = (
  state: Writable<IBuilderState>,
  armySchema: IArmySchema
) => {
  Object.entries(armySchema.units).forEach(([unitKey, schemaUnit]) => {
    if (schemaUnit.min) {
      addUnit(state, unitKey, schemaUnit, schemaUnit.min)
      return
    }

    if (schemaUnit.type === 'General') addUnit(state, unitKey, schemaUnit, 1)
  })
}

export const resetState = (
  state: Writable<IBuilderState>,
  armySchema: IArmySchema,
  magicItems: Record<string, ISchemaMagicItem>
) => {
  state.set({
    armyName: armySchema.name,
    armyCost: 0,
    armyCostLimit: 2000,
    units: {},
    armyErrors: [],
    regimentCountAs: {
      units: Object.fromEntries(Object.keys(armySchema.units).map(name => [name, 0])),
      upgrades: Object.fromEntries(Object.keys(armySchema.upgrades ?? {}).map(name => [name, 0]))
    },
    lookup: {
      magicItems: magicItems,
      armyUpgrades: armySchema.upgrades,
      armyStands: armySchema.stands
    }
  })

  addRequiredUnits(state, armySchema)
}