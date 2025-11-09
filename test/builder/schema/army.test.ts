import { expect, it, describe, expectTypeOf } from 'vitest'
import { readPublicFile } from '$test/ioUtils'


const factions = await readPublicFile<IFaction[]>('/factions.json') 
const magicItems = await readPublicFile<Record<string, ISchemaMagicItem>>('/magicItems.json')

describe.each(factions)('$name army', async (faction: IFaction) => {
  const army = await readPublicFile<IArmySchema>(`/armies/${faction.fileName}.json`)

  const units = Object.entries(army.units)
  const upgrades = Object.entries(army.upgrades ?? {})
  const stands = Object.entries(army.stands ?? {})

  const magicItemNames = Object.keys(magicItems)
  const upgradeNames = Object.keys(army.upgrades ?? {})
  const standsNames = Object.keys(army.stands ?? {})

  it('should have same name in factions file', () => {
    expect(army.name).toBe(faction.name)
  })

  it('should have general', () => {
    expect(units.some(([_, u]) => u.type === 'General')).toBeTruthy()
  })

  it('should have core fields', async () => {
    expect(army.name).toBe(faction.name)
    expectTypeOf(army.units).toEqualTypeOf<Record<string, ISchemaUnit>>()
  })

  it('units should have unique ids', () => {
    const unitIds = units.map(([_, u]) => u.id)
    const uniqueIds = new Set(unitIds)
    expect(uniqueIds.size, `Duplicate unit IDs found in ${army.name} army`).toBe(unitIds.length)
  })

  it('upgrades should have unique ids', () => {
    const upgradeIds = upgrades.map(([_, u]) => u.id)
    const uniqueIds = new Set(upgradeIds)
    expect(uniqueIds.size, `Duplicate unit IDs found in ${army.name} army`).toBe(upgradeIds.length)
  })

  describe.each(units)('Unit $0', async (name, unit) => {
    it('should have core fields', async () => {
      expect(unit.id, `Invalid unit id "${unit.id}". Expected e.g. ("U1", "U10")`).toMatch(/^U\d+$/)
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
      expect(unit.range, `Invalid "range" format "${unit.range}". Expected e.g. ("15cm", "30cm", "60cm")`)
        .toMatch(/^\d+\s*cm$/)
    })

    it.runIf(unit.armor)('should have valid armor format', () => {
      expect(unit.armor, `Invalid "armor" format "${unit.armor}". Expected e.g. ("4+", "-", "4+/-", "5+/6+")`)
        .toMatch(/^(\d\+|-)(\s*\/\s*(\d\+|-))?$/)
    })

    const isCommandUnit = ['General', 'Hero', 'Wizard'].includes(unit.type)
    it.runIf(isCommandUnit)('should have command fields', () => {
      expect(unit.size).toBe(1)
      expect(unit.command).toBeDefined()

      expect(unit.attack, `Invalid command unit attack format "${unit.attack}". Expected e.g. format (e.g. "+1", "+4")`)
        .toMatch(/^\+\d+$/)
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

  describe.each(upgrades)('Upgrade $0', (name, upgrade) => {
    it('should have core fields', () => {
      expect(upgrade.id, `Invalid upgrade id "${upgrade.id}". Expected e.g. ("UPG1", "UPG17")`).toMatch(/^UPG\d+$/)
      expect(name).toBeDefined()
      expectTypeOf(name).toEqualTypeOf<string>()
      expect(upgrade.type).toBeDefined()
      expectTypeOf(upgrade.type).toEqualTypeOf<UpgradeType>()
      expect(upgrade.cost).toBeDefined()
      expectTypeOf(upgrade.cost).toEqualTypeOf<number>()
    })
  })

  describe.each(stands)('Stand $0', (name, stand) => {
    it('should have core fields', () => {
      expect(stand.id, `Invalid unit id "${stand.id}". Expected e.g. ("S1", "S24")`).toMatch(/^S\d+$/)
      expect(name).toBeDefined()
      expectTypeOf(name).toEqualTypeOf<string>()
      expect(stand.size).toBeDefined()
      expectTypeOf(stand.size).toEqualTypeOf<number>()
      expect(stand.type).toBeDefined()
      expectTypeOf(stand.type).toEqualTypeOf<UnitType>()
      expect(stand.points).toBeDefined()
      expectTypeOf(stand.points).toEqualTypeOf<number>()
      expect(stand.attack).toBeDefined()
      expectTypeOf(stand.attack).toEqualTypeOf<string>()
    })
  })
})
