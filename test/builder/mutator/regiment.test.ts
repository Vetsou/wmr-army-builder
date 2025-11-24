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