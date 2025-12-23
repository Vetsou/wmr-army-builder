import { describe, it, expect, beforeEach } from 'vitest'

import * as DataGenerator from '$test/dataGenerator'
import * as TestCases from './cases'
import * as Serialize from '$builder/serialize'


describe('encodeArmyToUrl', () => {
  let store: IBuilderState

  beforeEach(() => store = DataGenerator.createBuilderState({}))

  it('returns empty string for empty state', () => {
    // Act
    const encoded = Serialize.encodeArmyToUrl(store.units, store.lookup)

    // Assert
    expect(encoded).toBe('')
  })

  it.each(TestCases.encodeUnitTestCases())('encodes $name', ({ setup, expected }) => {
    // Arrange
    setup(store)

    // Act
    const urlParams = decodeURIComponent(Serialize.encodeArmyToUrl(store.units, store.lookup))

    // Assert
    expect(urlParams).toBe(expected)
  })
})