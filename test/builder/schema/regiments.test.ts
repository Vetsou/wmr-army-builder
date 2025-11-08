import { expect, it, describe, expectTypeOf } from 'vitest'
import { readPublicFile } from '$test/ioUtils'


const factionNames = await readPublicFile<IFaction[]>('/factions.json').map(f => f.name)
const regiments = await readPublicFile<Record<string, ISchemaRegiment>>('/regimentsOfRenown.json')

describe.each(Object.entries(regiments))('$0 regiment', (name, regiment) => {
  it('should have core fields', () => {
    expect(regiment.id.startsWith('R')).toBe(true)
    expect(name).toBeDefined()
    expectTypeOf(name).toEqualTypeOf<string>()
    expect(regiment.size).toBeDefined()
    expectTypeOf(regiment.size).toEqualTypeOf<number>()
    expect(regiment.type).toBeDefined()
    expectTypeOf(regiment.type).toEqualTypeOf<UnitType>()
    expect(regiment.points).toBeDefined()
    expectTypeOf(regiment.points).toEqualTypeOf<number>()
    expect(regiment.attack).toBeDefined()
    expectTypeOf(regiment.attack).toEqualTypeOf<string>()
  })

  it.runIf(regiment.incompatibleFactions)('should have correct factions', () => {
    expect(Array.isArray(regiment.incompatibleFactions)).toBe(true)
    for (const faction of regiment.incompatibleFactions ?? []) {
      expect(factionNames).toContain(faction)
    }
  })

  it.runIf(regiment.incompatibleWith)('should have correct incompatible units', () => {
    const regimentNames = Object.keys(regiments)
    for (const target of regiment.incompatibleWith ?? []) {
      if (!target.startsWith('(')) {
        expect(regimentNames).toContain(target)
        continue
      }
    }
  })
})