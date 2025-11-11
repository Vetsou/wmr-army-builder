import { describe, it, expect, beforeEach } from 'vitest'
import { type Writable } from 'svelte/store'

import * as DataGenerator from '$test/dataGenerator'
import * as Serialization from '$builder/serialization'
import * as ArmyMutator from '$builder/mutator/army'
import * as UnitMutator from '$builder/mutator/unit'


let store: Writable<IBuilderState>

beforeEach(() => {
  store = DataGenerator.createBuilderState({})
})

describe('encodeArmyToUrl', () => {
  it('should return empty string for empty state', () => {
    // Assert
    expect(Serialization.encodeArmyToUrl(store)).toBe('')
  })

  it('encodes single simple unit', () => {
    // Arrange
    const schemaUnit = DataGenerator.createArmyUnit({ id: 'U1' })
    ArmyMutator.addUnit(store, 'UnitA', schemaUnit, 2)

    // Act
    const urlParams = Serialization.encodeArmyToUrl(store)

    // Assert
    expect(urlParams).toBe('U1=2')
  })

  it('encodes unit with item', () => {
    // Arrange
    const schemaUnit = DataGenerator.createArmyUnit({ id: 'U7' })
    ArmyMutator.addUnit(store, 'UnitA', schemaUnit, 2)
    const schemaItem = DataGenerator.createSchemaItem({ id: 'MI14' })
    UnitMutator.equipItem(store, 'UnitA', 'ItemA', schemaItem)

    // Act
    const urlParams = Serialization.encodeArmyToUrl(store)

    // Assert
    expect(decodeURIComponent(urlParams)).toBe('U7=2[MI14]')
  })

  it('encodes unit with two upgrades', () => {
    // Arrange
    const schemaUnit = DataGenerator.createArmyUnit({ id: 'U19' })
    ArmyMutator.addUnit(store, 'UnitA', schemaUnit, 14)
    const schemaUpgrade = DataGenerator.createSchemaUpgrade({ id: 'UPG17' })
    UnitMutator.equipUpgrade(store, 'UnitA', 'UpgradeA', schemaUpgrade)
    UnitMutator.equipUpgrade(store, 'UnitA', 'UpgradeA', schemaUpgrade)

    // Act
    const urlParams = Serialization.encodeArmyToUrl(store)

    // Assert
    expect(decodeURIComponent(urlParams)).toBe('U19=14[UPG17x2]')
  })

  it('encodes unit with multiple upgrades and items', () => {
    // Arrange
    const schemaUnit = DataGenerator.createArmyUnit({ id: 'U77' })
    ArmyMutator.addUnit(store, 'UnitA', schemaUnit, 6)

    const schemaUpgrade = DataGenerator.createSchemaUpgrade({ id: 'UPG17' })
    UnitMutator.equipUpgrade(store, 'UnitA', 'UpgradeA', schemaUpgrade)
    UnitMutator.equipUpgrade(store, 'UnitA', 'UpgradeA', schemaUpgrade)
    const schemaUpgrade2 = DataGenerator.createSchemaUpgrade({ id: 'UPG23' })
    UnitMutator.equipUpgrade(store, 'UnitA', 'UpgradeB', schemaUpgrade2)
    UnitMutator.equipUpgrade(store, 'UnitA', 'UpgradeB', schemaUpgrade2)

    const schemaItem = DataGenerator.createSchemaItem({ id: 'MI14' })
    UnitMutator.equipItem(store, 'UnitA', 'ItemA', schemaItem)
    const schemaItem2 = DataGenerator.createSchemaItem({ id: 'MI33' })
    UnitMutator.equipItem(store, 'UnitA', 'ItemB', schemaItem2)
    UnitMutator.equipItem(store, 'UnitA', 'ItemB', schemaItem2)

    // Act
    const urlParams = Serialization.encodeArmyToUrl(store)

    // Assert
    expect(decodeURIComponent(urlParams)).toBe('U77=6[UPG17x2,UPG23x2,MI14,MI33x2]')
  })

  it('encodes multiple units correctly', () => {
    // Arrange
    const schemaUnit = DataGenerator.createArmyUnit({ id: 'U132' })
    ArmyMutator.addUnit(store, 'UnitA', schemaUnit, 7)

    const schemaUpgrade = DataGenerator.createSchemaUpgrade({ id: 'UPG44' })
    UnitMutator.equipUpgrade(store, 'UnitA', 'UpgradeA', schemaUpgrade)
    UnitMutator.equipUpgrade(store, 'UnitA', 'UpgradeA', schemaUpgrade)
    const schemaUpgrade2 = DataGenerator.createSchemaUpgrade({ id: 'UPG21' })
    UnitMutator.equipUpgrade(store, 'UnitA', 'UpgradeB', schemaUpgrade2)
    UnitMutator.equipUpgrade(store, 'UnitA', 'UpgradeB', schemaUpgrade2)

    const schemaItem = DataGenerator.createSchemaItem({ id: 'MI75' })
    UnitMutator.equipItem(store, 'UnitA', 'ItemA', schemaItem)
    const schemaItem2 = DataGenerator.createSchemaItem({ id: 'MI92' })
    UnitMutator.equipItem(store, 'UnitA', 'ItemB', schemaItem2)
    UnitMutator.equipItem(store, 'UnitA', 'ItemB', schemaItem2)

    const schemaUnit2 = DataGenerator.createArmyUnit({ id: 'U7' })
    ArmyMutator.addUnit(store, 'UnitB', schemaUnit2, 11)

    const schemaUpgrade3 = DataGenerator.createSchemaUpgrade({ id: 'UPG77' })
    UnitMutator.equipUpgrade(store, 'UnitB', 'UpgradeC', schemaUpgrade3)
    const schemaUpgrade4 = DataGenerator.createSchemaUpgrade({ id: 'UPG9' })
    UnitMutator.equipUpgrade(store, 'UnitB', 'UpgradeD', schemaUpgrade4)
    UnitMutator.equipUpgrade(store, 'UnitB', 'UpgradeD', schemaUpgrade4)

    // Act
    const urlParams = Serialization.encodeArmyToUrl(store)

    // Assert
    expect(decodeURIComponent(urlParams)).toBe('U132=7[UPG44x2,UPG21x2,MI75,MI92x2]&U7=11[UPG77,UPG9x2]')
  })
})