import { expect, it, describe, expectTypeOf } from 'vitest'
import { readPublicFile } from '$test/ioUtils'


const factions = await readPublicFile<IFaction[]>('/factions.json') 
const magicItems = await readPublicFile<Record<string, ISchemaMagicItem>>('/magicItems.json')

describe.each(factions)('$name army', async (faction: IFaction) => {
  const army = await readPublicFile<IArmySchema>(`/armies/${faction.fileName}.json`)

  const units = Object.entries(army.units)
  const upgradeNames = Object.keys(army.upgrades ?? {})
  const standsNames = Object.keys(army.stands ?? {})
  const magicItemNames = Object.keys(magicItems)

  it('should have general', () => {
    expect(units.some(([_, u]) => u.type === 'General')).toBeTruthy()
  })

  it('should have core fields', async () => {
    expect(army.name).toBe(faction.name)
    expectTypeOf(army.units).toEqualTypeOf<Record<string, ISchemaUnit>>()
  })

  describe.each(units)('Unit $0', async (name, unit) => {
    it('should have core fields', async () => {
      expect(name).toBeDefined()
      expectTypeOf(name).toEqualTypeOf<string>()
      expect(unit.size).toBeDefined()
      expectTypeOf(unit.size).toEqualTypeOf<number>()
      expect(unit.type).toBeDefined()
      expectTypeOf(unit.type).toEqualTypeOf<UnitType>()
      expect(unit.points).toBeDefined()
      expectTypeOf(unit.points).toEqualTypeOf<number>()
      expect(unit.attack).toBeDefined()
      expectTypeOf(unit.attack).toEqualTypeOf<string>()
    })

    it.runIf(unit.range)('should have valid range', () => {
      // Match "15cm", "30cm", "60cm"
      expect(unit.range).toMatch(/^\d+\s*cm$/)
    })

    it.runIf(unit.armor)('should have valid armor format', () => {
      // Match "4+", "-", "4+/-", "5+/6+"
      expect(unit.armor).toMatch(/^(\d\+|-)(\s*\/\s*(\d\+|-))?$/)
    })

    const isCommandUnit = ['General', 'Hero', 'Wizard'].includes(unit.type)
    it.runIf(isCommandUnit)('should have command fields', () => {
      expect(unit.size).toBe(1)
      expect(unit.command).toBeDefined()

      // Match "+4", "+0", "+2"
      expect(unit.attack).toMatch(/^\+\d+$/)
    })

    it.runIf(unit.upgrades)('should have correct upgrades', () => {
      expect(Array.isArray(unit.upgrades)).toBe(true)
      for (const upgrade of unit.upgrades ?? []) {
        expect(upgradeNames).toContain(upgrade)
      }
    })

    it.runIf(unit.customItems)('should have valid customItems', () => {
      expect(Array.isArray(unit.customItems)).toBe(true)
      for (const item of unit.customItems ?? []) {
        expect(magicItemNames).toContain(item)
      }
    })

    it.runIf(unit.extraStands)('should have valid extraStands', () => {
      expect(Array.isArray(unit.extraStands)).toBe(true)
      for (const stand of unit.extraStands ?? []) {
        expect(standsNames).toContain(stand)
      }
    })
  })
})
