import { describe, it, expect, beforeEach } from 'vitest'
import { get, type Writable } from 'svelte/store'

import * as DataGenerator from '$test/dataGenerator'
import * as Serialization from '$builder/serialization'
import * as ArmyMutator from '$builder/mutator/army'
import * as UnitMutator from '$builder/mutator/unit'


describe('encodeArmyToUrl', () => {
  let store: Writable<IBuilderState>

  beforeEach(() => store = DataGenerator.createBuilderState({}))

  it('returns empty string for empty state', () => {
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

  it('encodes regiment unit', () => {
    // Arrange
    const schemaUnit = DataGenerator.createArmyUnit({ id: 'R17' })
    ArmyMutator.addRegiment(store, 'RegimentA', schemaUnit, {}, 7)

    // Act
    const urlParams = Serialization.encodeArmyToUrl(store)

    // Assert
    expect(decodeURIComponent(urlParams)).toBe('R17=7')
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

describe('decodeArmyFromUrl', () => {
  let store: Writable<IBuilderState>
  let armySchema: IArmySchema
  let magicItems: Record<string, ISchemaMagicItem>
  let schemaRegiments: Record<string, ISchemaRegiment>

  beforeEach(() => {
    store = DataGenerator.createBuilderState({})
    armySchema = DataGenerator.createArmySchema({
      name: 'TestArmy',
      units: {
        warriors: DataGenerator.createSchemaUnit({ id: 'U42', points: 25, upgrades: ['sword'], extraStands: ['rangers'] }),
        archers: DataGenerator.createSchemaUnit({ id: 'U45', points: 50, upgrades: ['sword'], extraStands: ['rangers'] })
      },
      upgrades: { sword: DataGenerator.createSchemaUpgrade({ id: 'UPG7', cost: 100 }) },
      stands: { rangers: DataGenerator.createSchemaUnit({ id: 'S9', points: 30 }) }
    })
    magicItems = { banner: DataGenerator.createSchemaItem({ id: 'MI13', cost: 50 }) }
    schemaRegiments = { regiment: DataGenerator.createRegimentSchema({ id: 'R11', points: 80 }) }
  })

  it('decodes simple unit', () => {
    // Arrange
    const encoded = 'U42=3'

    // Act
    Serialization.decodeArmyFromUrl(store, encoded, armySchema, magicItems, schemaRegiments)

    // Assert
    const state = get(store)
    expect(state.units.warriors.count).toBe(3)
    expect(state.armyCost).toBe(75)
  })

  it('decodes simple regiment', () => {
    // Arrange
    const encoded = 'R11=2'

    // Act
    Serialization.decodeArmyFromUrl(store, encoded, armySchema, magicItems, schemaRegiments)

    // Assert
    const state = get(store)
    expect(state.units.regiment.count).toBe(2)
    expect(state.armyCost).toBe(160)
  })

  it('decodes unit with item', () => {
    // Arrange
    const encoded = 'U42=2[MI13]'

    // Act
    Serialization.decodeArmyFromUrl(store, encoded, armySchema, magicItems, schemaRegiments)

    // Assert
    const state = get(store)
    expect(state.units.warriors.count).toBe(2)
    expect(state.units.warriors.equippedItems.banner).toBeDefined()
    expect(state.units.warriors.equippedItems.banner.count).toBe(1)
    expect(state.armyCost).toBe(100)
  })

  it('decodes units with 3 upgrades and 2 items', () => {
    // Arrange
    const encoded = 'U42=3[MI13x2,UPG7x3]'

    // Act
    Serialization.decodeArmyFromUrl(store, encoded, armySchema, magicItems, schemaRegiments)

    // Assert
    const state = get(store)
    expect(state.units.warriors.count).toBe(3)
    expect(state.units.warriors.equippedItems.banner.count).toBe(2)
    expect(state.units.warriors.equippedUpgrades.sword.count).toBe(3)
    expect(state.armyCost).toBe(475)
  })

  it('decodes unit and adds errors', () => {
    // Arrange
    const encoded = 'U42=2[MI13x3,UPG7x3]'

    // Act
    Serialization.decodeArmyFromUrl(store, encoded, armySchema, magicItems, schemaRegiments)

    // Assert
    const state = get(store)
    expect(state.units.warriors.errors.length).toBe(2)
    expect(state.units.warriors.errors[0]).toBe('2 warriors cannot have 3 item(s).')
    expect(state.units.warriors.errors[1]).toBe('2 warriors cannot have 3 upgrade(s).')
  })

  it('decodes multiple units correctly', () => {
    // Arrange
    const encoded = 'U42=2[MI13,UPG7x2]&U45=3[S9x3,MI13x2]'

    // Act
    Serialization.decodeArmyFromUrl(store, encoded, armySchema, magicItems, schemaRegiments)

    // Assert
    const state = get(store)
    expect(state.units.warriors.count).toBe(2)
    expect(state.units.warriors.equippedItems.banner.count).toBe(1)
    expect(state.units.warriors.equippedUpgrades.sword.count).toBe(2)
    expect(state.units.archers.count).toBe(3)
    expect(state.units.archers.equippedItems.banner.count).toBe(2)
    expect(state.units.archers.addedStands.rangers.count).toBe(3)
    expect(state.armyCost).toBe(640)
  })

  it('should not add units that are not in schema', () => {
    // Arrange
    const encoded = 'U7=2' // Unit with id 'U7' doesn't exist in schema

    // Act
    Serialization.decodeArmyFromUrl(store, encoded, armySchema, magicItems, schemaRegiments)

    // Assert
    const state = get(store)
    const unitsCount = Object.keys(state.units).length
    expect(unitsCount).toBe(0)
    expect(state.armyCost).toBe(0)
  })

  it('should not add items that are not in schema', () => {
    // Arrange
    const encoded = 'U42=1[MI2]'

    // Act
    Serialization.decodeArmyFromUrl(store, encoded, armySchema, magicItems, schemaRegiments)

    // Assert
    const state = get(store)
    const itemsCount = Object.keys(state.units.warriors.equippedItems).length
    expect(itemsCount).toBe(0)
    expect(state.armyCost).toBe(25) // Unit costs 25p
  })

  it('should not add upgrades that are not in schema', () => {
    // Arrange
    const encoded = 'U42=1[UPG3]'

    // Act
    Serialization.decodeArmyFromUrl(store, encoded, armySchema, magicItems, schemaRegiments)

    // Assert
    const state = get(store)
    const upgradeCount = Object.keys(state.units.warriors.equippedUpgrades).length
    expect(upgradeCount).toBe(0)
    expect(state.armyCost).toBe(25) // Unit costs 25p
  })

  it('should not add stands that are not in schema', () => {
    // Arrange
    const encoded = 'U42=1[S4]'

    // Act
    Serialization.decodeArmyFromUrl(store, encoded, armySchema, magicItems, schemaRegiments)

    // Assert
    const state = get(store)
    const standsCount = Object.keys(state.units.warriors.addedStands).length
    expect(standsCount).toBe(0)
    expect(state.armyCost).toBe(25) // Unit costs 25p
  })

  it('should not add regiments that are not in schema', () => {
    // Arrange
    const encoded = 'R34=3'

    // Act
    Serialization.decodeArmyFromUrl(store, encoded, armySchema, magicItems, schemaRegiments)

    // Assert
    const state = get(store)
    const regimentCount = Object.keys(state.units).length
    expect(regimentCount).toBe(0)
    expect(state.armyCost).toBe(0)
  })
})