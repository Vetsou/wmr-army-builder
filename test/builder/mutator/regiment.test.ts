import { beforeEach, describe, expect, it, vi } from 'vitest'
import { get, type Writable } from 'svelte/store'

import * as DataGenerator from '$test/dataGenerator'
import * as ArmyMutator from '$builder/mutator/army'

// Mocks
vi.mock('$builder/validator/unit', () => ({ validateUnit: vi.fn() }))
vi.mock('$builder/validator/army', () => ({ validateArmy: vi.fn() }))

import * as UnitValidator from '$builder/validator/unit'
import * as ArmyValidator from '$builder/validator/army'

let store: Writable<IBuilderState>

beforeEach(() => {
  store = DataGenerator.createBuilderState({
    regimentCountAs: {
      units: { unitA: 0 },
      upgrades: { upgradeA: 0 }
    }
  })
  vi.clearAllMocks()
})

describe('AddRegiment', () => {
  it('should add new regiment', () => {
    // Arrange
    const schemaRegiment = DataGenerator.createRegimentSchema({ points: 25 })

    // Act
    ArmyMutator.addRegiment(store, 'RegimentA', schemaRegiment, {}, 2)

    // Assert
    const state = get(store)
    expect(state.units.RegimentA.count).toBe(2)
    expect(state.armyCost).toBe(50)
    expect(UnitValidator.validateUnit).toHaveBeenCalled()
    expect(ArmyValidator.validateArmy).toHaveBeenCalled()
  })

  it('should set "regimentCountAs" unit data', () => {
    // Arrange
    const schemaRegiment = DataGenerator.createRegimentSchema({ points: 25 })

    // Act
    ArmyMutator.addRegiment(store, 'RegimentA', schemaRegiment, { unitName: 'unitA' }, 2)

    // Assert
    const state = get(store)
    expect(state.units.RegimentA).toBeDefined()
    expect(state.units.RegimentA.count).toBe(2)
    expect(state.armyCost).toBe(50)
    expect(state.regimentCountAs.units.unitA).toBe(2)
    expect(UnitValidator.validateUnit).toHaveBeenCalled()
    expect(ArmyValidator.validateArmy).toHaveBeenCalled()
  })

  it('should set "regimentCountAs" data for unit + upgrade', () => {
    // Arrange
    const schemaRegiment = DataGenerator.createRegimentSchema({ points: 25 })

    // Act
    ArmyMutator.addRegiment(store, 'RegimentA', schemaRegiment, { upgradeName: 'upgradeA', unitName: 'unitA' }, 2)

    // Assert
    const state = get(store)
    expect(state.units.RegimentA).toBeDefined()
    expect(state.units.RegimentA.count).toBe(2)
    expect(state.armyCost).toBe(50)
    expect(state.regimentCountAs.units.unitA).toBe(2)
    expect(state.regimentCountAs.upgrades.upgradeA).toBe(2)
    expect(UnitValidator.validateUnit).toHaveBeenCalled()
    expect(ArmyValidator.validateArmy).toHaveBeenCalled()
  })
})

describe('RemoveRegiment', () => {
  it('should remove regiment', () => {
    // Arrange
    const schemaRegiment = DataGenerator.createRegimentSchema({ points: 30 })
    ArmyMutator.addRegiment(store, 'RegimentA', schemaRegiment, {}, 3)

    // Act
    ArmyMutator.removeRegiment(store, 'RegimentA', schemaRegiment, {}, 1)

    // Assert
    const state = get(store)
    expect(state.units.RegimentA.count).toBe(2)
    expect(state.armyCost).toBe(60)
    expect(UnitValidator.validateUnit).toHaveBeenCalled()
    expect(ArmyValidator.validateArmy).toHaveBeenCalled()
  })

  it('should set "regimentCountAs" unit data', () => {
    // Arrange
    const schemaRegiment = DataGenerator.createRegimentSchema({ points: 35 })
    ArmyMutator.addRegiment(store, 'RegimentA', schemaRegiment, { unitName: 'unitA' }, 4)

    // Act
    ArmyMutator.removeRegiment(store, 'RegimentA', schemaRegiment, { unitName: 'unitA' }, 3)

    // Assert
    const state = get(store)
    expect(state.units.RegimentA).toBeDefined()
    expect(state.units.RegimentA.count).toBe(1)
    expect(state.armyCost).toBe(35)
    expect(state.regimentCountAs.units.unitA).toBe(1)
    expect(UnitValidator.validateUnit).toHaveBeenCalled()
    expect(ArmyValidator.validateArmy).toHaveBeenCalled()
  })

  it('should set "regimentCountAs" data for unit + upgrade', () => {
    // Arrange
    const schemaRegiment = DataGenerator.createRegimentSchema({ points: 45 })
    ArmyMutator.addRegiment(store, 'RegimentA', schemaRegiment, { upgradeName: 'upgradeA', unitName: 'unitA' }, 6)

    // Act
    ArmyMutator.removeRegiment(store, 'RegimentA', schemaRegiment, { upgradeName: 'upgradeA', unitName: 'unitA' }, 4)

    // Assert
    const state = get(store)
    expect(state.units.RegimentA).toBeDefined()
    expect(state.units.RegimentA.count).toBe(2)
    expect(state.armyCost).toBe(90)
    expect(state.regimentCountAs.units.unitA).toBe(2)
    expect(state.regimentCountAs.upgrades.upgradeA).toBe(2)
    expect(UnitValidator.validateUnit).toHaveBeenCalled()
    expect(ArmyValidator.validateArmy).toHaveBeenCalled()
  })
})