import { beforeEach, describe, expect, it } from 'vitest'
import { get, type Writable } from 'svelte/store'

import { ArmyErrors } from '$validator/army/messages'
import { formatError } from '$validator/internal'

import * as DataGenerator from 'test/dataGenerator'
import * as ArmyMutator from '$builder/mutator/army'
import * as UnitMutator from '$builder/mutator/unit'


let store: Writable<IBuilderState>

beforeEach(() => {
  store = DataGenerator.createBuilderState({
    armyCostLimit: 200,
    regimentCountAs: {
      units: { UnitA: 0, UnitB: 0 },
      upgrades: { UpgradeA: 0, UpgradeB: 0 }
    }
  })
})

describe('ValidateArmy', () => {
  it('adds error if army cost exceeds exceeds limit', () => {
    // Arrange
    const schemaUnit = DataGenerator.createSchemaUnit({ points: 250, type: 'General' })

    // Act
    ArmyMutator.addUnit(store, 'UnitA', schemaUnit, 1)

    // Assert
    const state = get(store)
    expect(state.armyErrors.length).toBe(1)
    expect(state.armyErrors).toStrictEqual([ArmyErrors.ArmyCostExceedsLimit])
  })

  it('adds error if no general', () => {
    // Arrange
    const schemaUnit = DataGenerator.createSchemaUnit({ points: 100, type: 'Cavalry' })

    // Act
    ArmyMutator.addUnit(store, 'UnitA', schemaUnit, 1)

    // Assert
    const state = get(store)
    expect(state.armyErrors.length).toBe(1)
    expect(state.armyErrors).toStrictEqual([ArmyErrors.ArmyNeedsGeneral])
  })

  it('adds error if duplicate magic items', () => {
    // Arrange
    const schemaUnit = DataGenerator.createSchemaUnit({ points: 50, type: 'General' })
    const schemaItem = DataGenerator.createSchemaItem({ cost: 10 })

    // Act
    ArmyMutator.addUnit(store, 'UnitA', schemaUnit, 1)
    UnitMutator.equipItem(store, 'UnitA', 'ItemA', schemaItem)
    UnitMutator.equipItem(store, 'UnitA', 'ItemA', schemaItem)

    // Assert
    const state = get(store)
    expect(state.armyErrors.length).toBe(1)
    expect(state.armyErrors).toStrictEqual([formatError(ArmyErrors.DuplicateMagicItem, 'ItemA')])
  })

  it('adds error if stand count is out of bounds', () => {
    // Arrage
    const schemaUnit = DataGenerator.createSchemaUnit({ points: 50, type: 'General' })
    const unitStandMax = DataGenerator.createSchemaUnit({ points: 20, type: 'Infantry', max: 1 })
    const unitStandArmyMax = DataGenerator.createSchemaUnit({ points: 20, type: 'Infantry', armyMax: 2 })

    // Act
    ArmyMutator.addUnit(store, 'UnitA', schemaUnit, 1)
    UnitMutator.addStand(store, 'UnitA', 'StandA', unitStandMax)
    UnitMutator.addStand(store, 'UnitA', 'StandA', unitStandMax)

    ArmyMutator.addUnit(store, 'UnitB', schemaUnit, 1)
    UnitMutator.addStand(store, 'UnitB', 'StandB', unitStandArmyMax)
    UnitMutator.addStand(store, 'UnitB', 'StandB', unitStandArmyMax)
    UnitMutator.addStand(store, 'UnitB', 'StandB', unitStandArmyMax)

    // Assert
    const state = get(store)
    expect(state.armyErrors.length).toBe(2)
    expect(state.armyErrors).toStrictEqual([
      formatError(ArmyErrors.StandOutOfBounds, 2, 'StandA'),
      formatError(ArmyErrors.StandOutOfBounds, 3, 'StandB'),
    ])
  })

  it('adds error if upgrade count is out of bounds', () => {
    // Arrage
    const schemaUnit = DataGenerator.createSchemaUnit({ points: 50, type: 'General' })
    const schemaUpgradeMax = DataGenerator.createSchemaUpgrade({ cost: 20, max: 2 })
    const schemaUpgradeArmyMax = DataGenerator.createSchemaUpgrade({ cost: 20, armyMax: 1 })

    // Act
    ArmyMutator.addUnit(store, 'UnitA', schemaUnit, 1)
    UnitMutator.equipUpgrade(store, 'UnitA', 'UpgradeA', schemaUpgradeMax)
    UnitMutator.equipUpgrade(store, 'UnitA', 'UpgradeA', schemaUpgradeMax)
    UnitMutator.equipUpgrade(store, 'UnitA', 'UpgradeA', schemaUpgradeMax)

    ArmyMutator.addUnit(store, 'UnitB', schemaUnit, 1)
    UnitMutator.equipUpgrade(store, 'UnitB', 'UpgradeB', schemaUpgradeArmyMax)
    UnitMutator.equipUpgrade(store, 'UnitB', 'UpgradeB', schemaUpgradeArmyMax)

    // Assert
    const state = get(store)
    expect(state.armyErrors.length).toBe(2)
    expect(state.armyErrors).toStrictEqual([
      formatError(ArmyErrors.UpgradeOutOfBounds, 3, 'UpgradeA', 2),
      formatError(ArmyErrors.UpgradeOutOfBounds, 2, 'UpgradeB', 1),
    ])
  })
})