import { beforeEach, describe, expect, it, vi } from 'vitest'
import { get, type Writable } from 'svelte/store'
import * as DataGenerator from 'test/dataGenerator'

import * as ArmyMutator from '$builder/mutator/armyMutator'

// Mocks
vi.mock('$builder/validator/unitRules', () => ({ validateUnit: vi.fn() }))
vi.mock('$builder/validator/armyRules', () => ({ validateArmy: vi.fn() }))

import * as UnitValidator from '$builder/validator/unitRules'
import * as ArmyValidator from '$builder/validator/armyRules'
import type { IBuilderState } from '$builder/store'

let store: Writable<IBuilderState>

beforeEach(() => {
  store = DataGenerator.createBuilderState()
  vi.clearAllMocks()
})

describe('addUnit', () => {
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

describe('removeUnit', () => {
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
})

describe('resetState', () => {
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
})