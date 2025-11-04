import { beforeEach, describe, expect, it } from 'vitest'
import { get, type Writable } from 'svelte/store'

import { ArmyErrors } from '$validator/army/messages'
import { formatError } from '$validator/internal'

import * as DataGenerator from '$test/dataGenerator'
import * as ArmyMutator from '$builder/mutator/army'
import * as UnitMutator from '$builder/mutator/unit'


let store: Writable<IBuilderState>

beforeEach(() => {
  store = DataGenerator.createBuilderState({
    armyCostLimit: 200,
    regimentCountAs: {
      units: { unitA: 0, unitB: 0 },
      upgrades: { upgradeA: 0, upgradeB: 0 }
    }
  })
})

describe('ValidateArmy', () => {
  it('adds error if army cost exceeds exceeds limit', () => {
    // Arrange
    const schemaUnit = DataGenerator.createSchemaUnit({ points: 250, type: 'General' })

    // Act
    ArmyMutator.addUnit(store, 'unitA', schemaUnit, 1)

    // Assert
    const state = get(store)
    expect(state.armyErrors.length).toBe(1)
    expect(state.armyErrors).toStrictEqual([ArmyErrors.armyCostExceedsLimit])
  })

  it('adds error if no general', () => {
    // Arrange
    const schemaUnit = DataGenerator.createSchemaUnit({ points: 100, type: 'Cavalry' })

    // Act
    ArmyMutator.addUnit(store, 'unitA', schemaUnit, 1)

    // Assert
    const state = get(store)
    expect(state.armyErrors.length).toBe(1)
    expect(state.armyErrors).toStrictEqual([ArmyErrors.armyNeedsGeneral])
  })

  it('adds error if duplicate magic items', () => {
    // Arrange
    const schemaUnit = DataGenerator.createSchemaUnit({ points: 50, type: 'General' })
    const schemaItem = DataGenerator.createSchemaItem({ cost: 10 })

    // Act
    ArmyMutator.addUnit(store, 'unitA', schemaUnit, 1)
    UnitMutator.equipItem(store, 'unitA', 'itemA', schemaItem)
    UnitMutator.equipItem(store, 'unitA', 'itemA', schemaItem)

    // Assert
    const state = get(store)
    expect(state.armyErrors.length).toBe(1)
    expect(state.armyErrors).toStrictEqual([formatError(ArmyErrors.duplicateMagicItem, 'itemA')])
  })

  it('adds error if stand count is out of bounds', () => {
    // Arrage
    const schemaUnit = DataGenerator.createSchemaUnit({ points: 50, type: 'General' })
    const unitStandMax = DataGenerator.createSchemaUnit({ points: 20, type: 'Infantry', max: 1 })
    const unitStandArmyMax = DataGenerator.createSchemaUnit({ points: 20, type: 'Infantry', armyMax: 2 })

    // Act
    ArmyMutator.addUnit(store, 'unitA', schemaUnit, 1)
    UnitMutator.addStand(store, 'unitA', 'standA', unitStandMax)
    UnitMutator.addStand(store, 'unitA', 'standA', unitStandMax)

    ArmyMutator.addUnit(store, 'unitB', schemaUnit, 1)
    UnitMutator.addStand(store, 'unitB', 'standB', unitStandArmyMax)
    UnitMutator.addStand(store, 'unitB', 'standB', unitStandArmyMax)
    UnitMutator.addStand(store, 'unitB', 'standB', unitStandArmyMax)

    // Assert
    const state = get(store)
    expect(state.armyErrors.length).toBe(2)
    expect(state.armyErrors).toStrictEqual([
      formatError(ArmyErrors.standOutOfBounds, 2, 'standA'),
      formatError(ArmyErrors.standOutOfBounds, 3, 'standB'),
    ])
  })

  it('adds error if upgrade count is out of bounds', () => {
    // Arrage
    const schemaUnit = DataGenerator.createSchemaUnit({ points: 50, type: 'General' })
    const schemaUpgradeMax = DataGenerator.createSchemaUpgrade({ cost: 20, max: 2 })
    const schemaUpgradeArmyMax = DataGenerator.createSchemaUpgrade({ cost: 20, armyMax: 1 })

    // Act
    ArmyMutator.addUnit(store, 'unitA', schemaUnit, 1)
    UnitMutator.equipUpgrade(store, 'unitA', 'upgradeA', schemaUpgradeMax)
    UnitMutator.equipUpgrade(store, 'unitA', 'upgradeA', schemaUpgradeMax)
    UnitMutator.equipUpgrade(store, 'unitA', 'upgradeA', schemaUpgradeMax)

    ArmyMutator.addUnit(store, 'unitB', schemaUnit, 1)
    UnitMutator.equipUpgrade(store, 'unitB', 'upgradeB', schemaUpgradeArmyMax)
    UnitMutator.equipUpgrade(store, 'unitB', 'upgradeB', schemaUpgradeArmyMax)

    // Assert
    const state = get(store)
    expect(state.armyErrors.length).toBe(2)
    expect(state.armyErrors).toStrictEqual([
      formatError(ArmyErrors.upgradeOutOfBounds, 3, 'upgradeA', 2),
      formatError(ArmyErrors.upgradeOutOfBounds, 2, 'upgradeB', 1),
    ])
  })
})