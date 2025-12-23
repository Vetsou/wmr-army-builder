import { beforeEach, describe, expect, it, vi } from 'vitest'
import { get } from 'svelte/store'

import * as DataGenerator from '$test/dataGenerator'
import * as ArmyMutator from '$builder/mutator/army'
import * as UnitMutator from '$builder/mutator/unit'

// Mocks
vi.mock('$builder/validator/unit', () => ({ validateUnit: vi.fn() }))
vi.mock('$builder/validator/army', () => ({ validateArmy: vi.fn() }))

import * as UnitValidator from '$builder/validator/unit'
import * as ArmyValidator from '$builder/validator/army'


let store: IBuilderState

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
    const armyCost = get(store.armyCost)
    const units = get(store.units)

    expect(units.UnitA.count).toBe(2)
    expect(armyCost).toBe(30)
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
    const armyCost = get(store.armyCost)
    const units = get(store.units)

    expect(units.UnitA.count).toBe(1)
    expect(armyCost).toBe(30)
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
    const armyCost = get(store.armyCost)
    const units = get(store.units)

    expect(units.UnitA).toBeUndefined()
    expect(armyCost).toBe(0)
  })

  it('removes all items from deleted unit', () => {
    // Arrange
    const schemaUnit = DataGenerator.createArmyUnit({ points: 35 })
    const item = DataGenerator.createSchemaItem({ cost: 100 })
    ArmyMutator.addUnit(store, 'UnitA', schemaUnit, 2)
    UnitMutator.equipItem(store, 'UnitA', 'ItemA', item)

    // Act & Assert
    expect(get(store.armyCost)).toBe(170)

    ArmyMutator.removeUnit(store, 'UnitA', schemaUnit, 2)

    expect(get(store.units).UnitA).toBeUndefined()
    expect(get(store.armyCost)).toBe(0)
  })
})


describe('CreateState', () => {
  it('removes all unit and updates state', () => {
    // Arrange
    const schemaUnit = DataGenerator.createArmyUnit({ points: 5 })
    ArmyMutator.addUnit(store, 'UnitA', schemaUnit, 3)
    ArmyMutator.addUnit(store, 'UnitB', schemaUnit, 2)
    ArmyMutator.addUnit(store, 'UnitC', schemaUnit, 7)

    // Act
    store = ArmyMutator.createDefaultState({
      name: 'Test army name',
      units: {}
    }, {}, {})

    // Assert
    const armyCost = get(store.armyCost)
    const armyCostLimit = get(store.armyCostLimit)
    const units = get(store.units)

    expect(units).toMatchObject({})
    expect(armyCost).toBe(0)
    expect(armyCostLimit).toBe(2000)
  })

  it('adds required units and update army cost', () => {
    // Arrange
    const schema = DataGenerator.createArmySchema({
      units: {
        unitA: DataGenerator.createSchemaUnit({ points: 15, min: 3 }),
        unitGeneral: DataGenerator.createSchemaUnit({ points: 50, type: 'General' })
      }
    })

    // Act
    store = ArmyMutator.createDefaultState(schema, {}, {})

    // Assert
    const armyCost = get(store.armyCost)
    const armyCostLimit = get(store.armyCostLimit)
    const units = get(store.units)

    expect(armyCost).toBe(95)
    expect(armyCostLimit).toBe(2000)
    expect(units.unitA.count).toBe(3)
    expect(units.unitGeneral.count).toBe(1)
  })
})