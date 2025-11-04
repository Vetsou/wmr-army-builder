import { beforeEach, describe, expect, it, vi } from 'vitest'
import { get, type Writable } from 'svelte/store'

import * as DataGenerator from 'test/dataGenerator'
import * as ArmyMutator from '$builder/mutator/army'
import * as UnitMutator from '$builder/mutator/unit'

// Mocks
vi.mock('$builder/validator/unit', () => ({ validateUnit: vi.fn() }))
vi.mock('$builder/validator/army', () => ({ validateArmy: vi.fn() }))

import * as UnitValidator from '$builder/validator/unit'
import * as ArmyValidator from '$builder/validator/army'


let store: Writable<IBuilderState>

beforeEach(() => {
  store = DataGenerator.createBuilderState({})
  vi.clearAllMocks()
})

describe('AddUnit', () => {
  it('adds new unit and updates army cost', () => {
    // Arrange
    const schemaUnit = DataGenerator.createSchemaUnit({ points: 15 })

    // Act
    ArmyMutator.addUnit(store, 'UnitA', schemaUnit, 2)

    // Assert
    const state = get(store)
    expect(state.units.UnitA.count).toBe(2)
    expect(state.armyCost).toBe(30)
    expect(UnitValidator.validateUnit).toHaveBeenCalled()
    expect(ArmyValidator.validateArmy).toHaveBeenCalled()
  })
})


describe('RemoveUnit', () => {
  it('removes unit and updates army cost', () => {
    // Arrange
    const schemaUnit = DataGenerator.createArmyUnit({ points: 30 })
    ArmyMutator.addUnit(store, 'UnitA', schemaUnit, 2)

    // Act
    ArmyMutator.removeUnit(store, 'UnitA', schemaUnit, 1)

    // Assert
    const state = get(store)
    expect(state.units.UnitA.count).toBe(1)
    expect(state.armyCost).toBe(30)
    expect(UnitValidator.validateUnit).toHaveBeenCalled()
    expect(ArmyValidator.validateArmy).toHaveBeenCalled()
  })

  it('deletes unit record if count is 0', () => {
    // Arrange
    const schemaUnit = DataGenerator.createArmyUnit({ points: 35 })
    ArmyMutator.addUnit(store, 'UnitA', schemaUnit, 2)

    // Act
    ArmyMutator.removeUnit(store, 'UnitA', schemaUnit, 2)

    // Assert
    const state = get(store)
    expect(state.units.UnitA).toBeUndefined()
    expect(state.armyCost).toBe(0)
  })

  it('removes all items from deleted unit', () => {
    // Arrange
    const schemaUnit = DataGenerator.createArmyUnit({ points: 35 })
    const item = DataGenerator.createSchemaItem({ cost: 100 })
    ArmyMutator.addUnit(store, 'UnitA', schemaUnit, 2)
    UnitMutator.equipItem(store, "UnitA", "ItemA", item)

    // Act & Assert
    const state = get(store)
    expect(state.armyCost).toBe(170)

    ArmyMutator.removeUnit(store, 'UnitA', schemaUnit, 2)

    expect(state.units.UnitA).toBeUndefined()
    expect(state.armyCost).toBe(0)
  })
})


describe('ResetState', () => {
  it('removes all unit and updates state', () => {
    // Arrange
    const schemaUnit = DataGenerator.createArmyUnit({ points: 5 })
    ArmyMutator.addUnit(store, 'UnitA', schemaUnit, 3)
    ArmyMutator.addUnit(store, 'UnitB', schemaUnit, 2)
    ArmyMutator.addUnit(store, 'UnitC', schemaUnit, 7)

    // Act
    ArmyMutator.resetState(store, DataGenerator.createArmySchema({}), {})

    // Assert
    const state = get(store)
    expect(state.units).toMatchObject({})
    expect(state.armyCost).toBe(0)
    expect(state.armyCostLimit).toBe(2000)
  })

  it('adds required units and update army cost', () => {
    // Arrange
    const schema = DataGenerator.createArmySchema({
      units: {
        "UnitA": DataGenerator.createSchemaUnit({ points: 15, min: 3 }),
        "UnitGeneral": DataGenerator.createSchemaUnit({ points: 50, type: 'General' })
      }
    })

    // Act
    ArmyMutator.resetState(store, schema, {})

    // Assert
    const state = get(store)
    expect(state.armyCost).toBe(95)
    expect(state.armyCostLimit).toBe(2000)
    expect(state.units.UnitA.count).toBe(3)
    expect(state.units.UnitGeneral.count).toBe(1)
  })
})