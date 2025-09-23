import type { Writable } from 'svelte/store'
import type { IBuilderState } from '$builder/store'
import * as UnitValidator from '$builder/validator/unitRules'
import * as ArmyValidator from '$builder/validator/armyRules'

type UnitMutationFn = (s: IBuilderState, unit: IArmyUnit) => void

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
    (s, armyUnit) => {
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
    (s, armyUnit) => {
      armyUnit.count -= count
      s.armyCost -= unitData.points * count

      // Remove items and upgrades if unit is deleted
      if (armyUnit.count === 0) {
        s.armyCost -= getUnitAugmentsCost(armyUnit)
      }
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
    lookup: {
      magicItems: magicItems,
      armyUpgrades: armySchema.upgrades,
      armyStands: armySchema.stands
    }
  })

  addRequiredUnits(state, armySchema)
}