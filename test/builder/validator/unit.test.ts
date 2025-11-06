import { beforeEach, describe, expect, it } from 'vitest'
import { get, type Writable } from 'svelte/store'

import * as DataGenerator from '$test/dataGenerator'
import * as ArmyMutator from '$builder/mutator/army'
import * as UnitMutator from '$builder/mutator/unit'


let store: Writable<IBuilderState>

beforeEach(() => {
  store = DataGenerator.createBuilderState({
    armyCostLimit: 3000,
    regimentCountAs: {
      units: { unitA: 0 },
      upgrades: { upgradeA: 0 }
    }
  })
})

describe('ValidateUnit', () => {
  it('adds error if unit count more than max', () => {
    // Arrange
    const schemaUnit = DataGenerator.createSchemaUnit({ points: 100, max: 1 })

    // Act
    ArmyMutator.addUnit(store, 'unitA', schemaUnit, 2)

    // Assert
    const state = get(store)
    expect(state.units.unitA.errors.length).toBe(1)
    expect(state.units.unitA.errors[0]).toBe('unitA count of 2 is out of bounds.')
  })

  it('wont add error if unit count more than max when points more than 1000', () => {
    // Arrange
    const schemaUnit = DataGenerator.createSchemaUnit({ points: 800, max: 1 })

    // Act
    ArmyMutator.addUnit(store, 'unitA', schemaUnit, 2)

    // Assert
    const state = get(store)
    expect(state.units.unitA.errors.length).toBe(0)
  })

  it('adds error if unit count more than army max', () => {
    // Arrange
    const schemaUnit = DataGenerator.createSchemaUnit({ points: 100, armyMax: 2 })

    // Act
    ArmyMutator.addUnit(store, 'unitA', schemaUnit, 3)

    // Assert
    const state = get(store)
    expect(state.units.unitA.errors.length).toBe(1)
    expect(state.units.unitA.errors[0]).toBe('unitA count of 3 is out of bounds.')
  })

  it('adds error if unit count lower than item count', () => {
    // Arrange
    const schemaUnit = DataGenerator.createSchemaUnit({ points: 100 })
    ArmyMutator.addUnit(store, 'unitA', schemaUnit, 2)
    const schemaItem = DataGenerator.createSchemaItem({ cost: 50 })

    // Act
    UnitMutator.equipItem(store, 'unitA', 'itemA', schemaItem)
    UnitMutator.equipItem(store, 'unitA', 'itemA', schemaItem)
    UnitMutator.equipItem(store, 'unitA', 'itemA', schemaItem)

    // Assert
    const state = get(store)
    expect(state.units.unitA.errors.length).toBe(1)
    expect(state.units.unitA.errors[0]).toBe('2 unitA cannot have 3 item(s).')
  })

  it('adds error if unit count lower than upgrade count', () => {
    // Arrange
    const schemaUnit = DataGenerator.createSchemaUnit({ points: 100 })
    ArmyMutator.addUnit(store, 'unitA', schemaUnit, 2)
    const schemaUpgrade = DataGenerator.createSchemaUpgrade({ cost: 50 })

    // Act
    UnitMutator.equipUpgrade(store, 'unitA', 'upgradeA', schemaUpgrade)
    UnitMutator.equipUpgrade(store, 'unitA', 'upgradeA', schemaUpgrade)
    UnitMutator.equipUpgrade(store, 'unitA', 'upgradeA', schemaUpgrade)

    // Assert
    const state = get(store)
    expect(state.units.unitA.errors.length).toBe(1)
    expect(state.units.unitA.errors[0]).toBe('2 unitA cannot have 3 upgrade(s).')
  })

  it('adds error if unit count lower than stand count', () => {
    // Arrange
    const schemaUnit = DataGenerator.createSchemaUnit({ points: 100 })
    ArmyMutator.addUnit(store, 'unitA', schemaUnit, 2)
    const schemaStand = DataGenerator.createArmyUnit({ points: 50 })

    // Act
    UnitMutator.addStand(store, 'unitA', 'standA', schemaStand)
    UnitMutator.addStand(store, 'unitA', 'standA', schemaStand)
    UnitMutator.addStand(store, 'unitA', 'standA', schemaStand)

    // Assert
    const state = get(store)
    expect(state.units.unitA.errors.length).toBe(1)
    expect(state.units.unitA.errors[0]).toBe('2 unitA cannot have 3 stand(s).')
  })
})