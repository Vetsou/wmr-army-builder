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

describe('EquipItem', () => {
  it('adds item to a unit and updates army cost', () => {
    // Arrange
    const schemaUnit = DataGenerator.createArmyUnit({ points: 50 })
    ArmyMutator.addUnit(store, 'UnitA', schemaUnit, 1)
    const schemaItem = DataGenerator.createSchemaItem({ cost: 10, type: 'Device of Power' })

    // Act
    UnitMutator.equipItem(store, 'UnitA', 'ItemA', schemaItem)

    // Assert
    const state = get(store)
    expect(state.armyCost).toBe(60)
    expect(state.units.UnitA.equippedItems.ItemA.count).toBe(1)
    expect(state.units.UnitA.equippedItems.ItemA.type).toBe('Device of Power')
    expect(UnitValidator.validateUnit).toHaveBeenCalledTimes(2)
    expect(ArmyValidator.validateArmy).toHaveBeenCalledTimes(2)
  })

  it('updates count if item already present', () => {
    // Arrange
    const schemaUnit = DataGenerator.createArmyUnit({ points: 50 })
    ArmyMutator.addUnit(store, 'UnitA', schemaUnit, 1)
    const schemaItem = DataGenerator.createSchemaItem({ cost: 10 })

    // Act
    UnitMutator.equipItem(store, 'UnitA', 'ItemA', schemaItem)
    UnitMutator.equipItem(store, 'UnitA', 'ItemA', schemaItem)
    UnitMutator.equipItem(store, 'UnitA', 'ItemA', schemaItem)

    // Assert
    const state = get(store)
    expect(state.armyCost).toBe(80)
    expect(state.units.UnitA.equippedItems.ItemA.count).toBe(3)
    expect(Object.values(state.units.UnitA.equippedItems).length).toBe(1)
  })
})


describe('UnequipItem', () => {
  it('decreases count if more than zero', () => {
    // Arrange
    const schemaUnit = DataGenerator.createArmyUnit({ points: 50 })
    const schemaItem = DataGenerator.createSchemaItem({ cost: 10 })
    ArmyMutator.addUnit(store, 'UnitA', schemaUnit, 1)
    UnitMutator.equipItem(store, 'UnitA', 'ItemA', schemaItem)
    UnitMutator.equipItem(store, 'UnitA', 'ItemA', schemaItem)
    UnitMutator.equipItem(store, 'UnitA', 'ItemA', schemaItem)

    // Act
    UnitMutator.unequipItem(store, 'UnitA', 'ItemA')

    // Assert
    const state = get(store)
    expect(state.armyCost).toBe(70)
    expect(state.units.UnitA.equippedItems.ItemA.count).toBe(2)
    expect(Object.values(state.units.UnitA.equippedItems).length).toBe(1)
  })

  it('removes item if count is zero', () => {
    // Arrange
    const schemaUnit = DataGenerator.createArmyUnit({ points: 50 })
    const schemaItem = DataGenerator.createSchemaItem({ cost: 10 })
    ArmyMutator.addUnit(store, 'UnitA', schemaUnit, 1)
    UnitMutator.equipItem(store, 'UnitA', 'ItemA', schemaItem)

    // Act
    UnitMutator.unequipItem(store, 'UnitA', 'ItemA')

    // Assert
    const state = get(store)
    expect(state.armyCost).toBe(50)
    expect(state.units.UnitA.equippedItems.ItemA).toBeUndefined()
    expect(Object.values(state.units.UnitA.equippedItems).length).toBe(0)
    expect(UnitValidator.validateUnit).toHaveBeenCalledTimes(3)
    expect(ArmyValidator.validateArmy).toHaveBeenCalledTimes(3)
  })
})


describe('EquipUpgrade', () => {
  it('adds upgrade to a unit and updates army cost', () => {
    // Arrange
    const schemaUnit = DataGenerator.createArmyUnit({ points: 50 })
    ArmyMutator.addUnit(store, 'UnitA', schemaUnit, 1)
    const schemaUpgrade = DataGenerator.createSchemaUpgrade({ cost: 10 })

    // Act
    UnitMutator.equipUpgrade(store, 'UnitA', 'UpgradeA', schemaUpgrade)

    // Assert
    const state = get(store)
    expect(state.armyCost).toBe(60)
    expect(state.units.UnitA.equippedUpgrades.UpgradeA.count).toBe(1)
    expect(Object.values(state.units.UnitA.equippedUpgrades).length).toBe(1)
    expect(UnitValidator.validateUnit).toHaveBeenCalledTimes(2)
    expect(ArmyValidator.validateArmy).toHaveBeenCalledTimes(2)
  })

  it('updates count if item already present', () => {
    // Arrange
    const schemaUnit = DataGenerator.createArmyUnit({ points: 50 })
    ArmyMutator.addUnit(store, 'UnitA', schemaUnit, 1)
    const schemaUpgrade = DataGenerator.createSchemaUpgrade({ cost: 25 })

    // Act
    UnitMutator.equipUpgrade(store, 'UnitA', 'UpgradeA', schemaUpgrade)
    UnitMutator.equipUpgrade(store, 'UnitA', 'UpgradeA', schemaUpgrade)
    UnitMutator.equipUpgrade(store, 'UnitA', 'UpgradeA', schemaUpgrade)

    // Assert
    const state = get(store)
    expect(state.armyCost).toBe(125)
    expect(state.units.UnitA.equippedUpgrades.UpgradeA.count).toBe(3)
    expect(Object.values(state.units.UnitA.equippedUpgrades).length).toBe(1)
  })
})


describe('UnequipUpgrade', () => {
  it('decreases count if more than zero', () => {
    // Arrange
    const schemaUnit = DataGenerator.createArmyUnit({ points: 50 })
    ArmyMutator.addUnit(store, 'UnitA', schemaUnit, 1)
    const schemaUpgrade = DataGenerator.createSchemaUpgrade({ cost: 25 })
    UnitMutator.equipUpgrade(store, 'UnitA', 'UpgradeA', schemaUpgrade)
    UnitMutator.equipUpgrade(store, 'UnitA', 'UpgradeA', schemaUpgrade)
    UnitMutator.equipUpgrade(store, 'UnitA', 'UpgradeA', schemaUpgrade)

    // Act
    UnitMutator.unequipUpgrade(store, 'UnitA', 'UpgradeA')

    // Assert
    const state = get(store)
    expect(state.armyCost).toBe(100)
    expect(state.units.UnitA.equippedUpgrades.UpgradeA.count).toBe(2)
    expect(Object.values(state.units.UnitA.equippedUpgrades).length).toBe(1)
  })

  it('removes upgrade if count is zero', () => {
    // Arrange
    const schemaUnit = DataGenerator.createArmyUnit({ points: 50 })
    ArmyMutator.addUnit(store, 'UnitA', schemaUnit, 1)
    const schemaUpgrade = DataGenerator.createSchemaUpgrade({ cost: 20 })
    UnitMutator.equipUpgrade(store, 'UnitA', 'UpgradeA', schemaUpgrade)

    // Act
    UnitMutator.unequipUpgrade(store, 'UnitA', 'UpgradeA')

    // Assert
    const state = get(store)
    expect(state.armyCost).toBe(50)
    expect(state.units.UnitA.equippedUpgrades.UpgradeA).toBeUndefined()
    expect(Object.values(state.units.UnitA.equippedUpgrades).length).toBe(0)
    expect(UnitValidator.validateUnit).toHaveBeenCalledTimes(3)
    expect(ArmyValidator.validateArmy).toHaveBeenCalledTimes(3)
  })
})


describe('AddStand', () => {
  it('adds stand to a unit and updates army cost', () => {
    // Arrange
    const schemaUnit = DataGenerator.createArmyUnit({ points: 30 })
    ArmyMutator.addUnit(store, 'UnitA', schemaUnit, 1)
    const standUnit = DataGenerator.createArmyUnit({ points: 10 })

    // Act
    UnitMutator.addStand(store, 'UnitA', 'StandA', standUnit)

    // Assert
    const state = get(store)
    expect(state.armyCost).toBe(40)
    expect(state.units.UnitA.addedStands.StandA.count).toBe(1)
    expect(UnitValidator.validateUnit).toHaveBeenCalledTimes(2)
    expect(ArmyValidator.validateArmy).toHaveBeenCalledTimes(2)
  })

  it('updates count if item already present', () => {
    // Arrange
    const schemaUnit = DataGenerator.createArmyUnit({ points: 30 })
    ArmyMutator.addUnit(store, 'UnitA', schemaUnit, 1)
    const standUnit = DataGenerator.createArmyUnit({ points: 20 })

    // Act
    UnitMutator.addStand(store, 'UnitA', 'StandA', standUnit)
    UnitMutator.addStand(store, 'UnitA', 'StandA', standUnit)
    UnitMutator.addStand(store, 'UnitA', 'StandA', standUnit)

    // Assert
    const state = get(store)
    expect(state.armyCost).toBe(90)
    expect(state.units.UnitA.addedStands.StandA.count).toBe(3)
    expect(Object.values(state.units.UnitA.addedStands).length).toBe(1)
  })
})


describe('RemoveStand', () => {
  it('decreases count if more than zero', () => {
    // Arrange
    const schemaUnit = DataGenerator.createArmyUnit({ points: 40 })
    ArmyMutator.addUnit(store, 'UnitA', schemaUnit, 1)
    const standUnit = DataGenerator.createArmyUnit({ points: 20 })
    UnitMutator.addStand(store, 'UnitA', 'StandA', standUnit)
    UnitMutator.addStand(store, 'UnitA', 'StandA', standUnit)
    UnitMutator.addStand(store, 'UnitA', 'StandA', standUnit)

    // Act
    UnitMutator.removeStand(store, 'UnitA', 'StandA')

    // Assert
    const state = get(store)
    expect(state.armyCost).toBe(80)
    expect(state.units.UnitA.addedStands.StandA.count).toBe(2)
    expect(Object.values(state.units.UnitA.addedStands).length).toBe(1)
  })

  it('removes stand if count is zero', () => {
    // Arrange
    const schemaUnit = DataGenerator.createArmyUnit({ points: 30 })
    ArmyMutator.addUnit(store, 'UnitA', schemaUnit, 1)
    const standUnit = DataGenerator.createArmyUnit({ points: 20 })
    UnitMutator.addStand(store, 'UnitA', 'StandA', standUnit)

    // Act
    UnitMutator.removeStand(store, 'UnitA', 'StandA')

    // Assert
    const state = get(store)
    expect(state.armyCost).toBe(30)
    expect(state.units.UnitA.addedStands.StandA).toBeUndefined()
    expect(Object.values(state.units.UnitA.addedStands).length).toBe(0)
    expect(UnitValidator.validateUnit).toHaveBeenCalledTimes(3)
    expect(ArmyValidator.validateArmy).toHaveBeenCalledTimes(3)
  })
})