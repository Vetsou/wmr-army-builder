import { expect, it, describe, expectTypeOf } from 'vitest'
import { readPublicFile } from '$test/ioUtils'


const magicItems = await readPublicFile<Record<string, ISchemaMagicItem>>('/magicItems.json')

const validUnitTypes: UnitType[] = [
  'Infantry',
  'Cavalry',
  'Chariots',
  'Monsters',
  'Artillery',
  'Machines',
  'General',
  'Hero',
  'Wizard',
  'Special'
]

describe('Magic items', () => {
  it('should have unique ids', () => {
    const itemEntries = Object.entries(magicItems)
    const itemIds = itemEntries.map(([_, mi]) => mi.id)

    const uniqueIds = new Set(itemIds)
    expect(uniqueIds.size, 'Duplicate unit IDs found in magic items').toBe(itemIds.length)
  })
})

describe.each(Object.entries(magicItems))('$0 magic item', (name, magicItem) => {
  it('should have core fields', () => {
    expect(magicItem.id, `Invalid regiment id "${magicItem.id}". Expected e.g. ("MI1", "MI23")`).toMatch(/^MI\d+$/)
    expect(name).toBeDefined()
    expectTypeOf(name).toEqualTypeOf<string>()
    expect(magicItem.type).toBeDefined()
    expectTypeOf(magicItem.type).toEqualTypeOf<MagicItemType>()
    expect(magicItem.allowedUnits.length).toBeGreaterThan(0)
    for (const unitType of magicItem.allowedUnits) {
      expect(validUnitTypes).toContain(unitType)
    }
  })

  it.runIf(typeof magicItem.cost === 'number')('should not define stat for flat cost', () => {
    expect(magicItem.stat).toBeUndefined()
  })

  it.runIf(typeof magicItem.cost === 'object')('should define stat for variable cost', () => {
    expect(magicItem.stat).toBeDefined()
    expect(['armor', 'hits']).toContain(magicItem.stat)
  })
})