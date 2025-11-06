declare global {
  /**
   * Represents a faction entry in the global faction list.
   * Each faction corresponds to a distinct army with its own schema file.
   */
  interface IFaction {
    name: string
    fileName: string
  }

  /**
   * Defines the structure of an army schema file.
   */
  interface IArmySchema {
    name: string
    units: Record<string, ISchemaUnit>
    upgrades?: Record<string, ISchemaUpgrade>
    stands?: Record<string, ISchemaUnit>
  }

  /**
   * Possible unit categories across all armies.
   */
  type UnitType =
    'Infantry' | 'Cavalry'   | 'Chariots' |
    'Monsters' | 'Artillery' | 'Machines' |
    'General'  | 'Hero'      | 'Wizard'   |
    'Special'

  /**
   * Base definition of a unit as it appears in a faction schema file.
   * Describes the unit's profile, type, restrictions, and upgrade options.
   */
  interface ISchemaUnit {
    urlId?: string
    type: UnitType

    // --- Core Stats ---
    points: number   // base cost in army points
    attack: string   // attack value or modifier (e.g. "3", "3/1", "+2")
    size: number     // number of stands in the unit
    armor?: string   // armor save (e.g. "4+", "5+", or "-")
    hits?: number    // number of wounds the unit can take
    range?: string   // shooting range (e.g. "30cm")
    command?: number // command value for characters (General, Hero, Wizard)

    // --- Tags ---
    flying?: boolean

    // --- Composition Limits ---
    min?: number     // minimum number of this unit in the army per 1000 points
    max?: number     // maximum number of this unit in the army per 1000 points
    armyMax?: number // army-wide maximum for this unit

    // --- Attachments ---
    customItems?: string[] // magic items available for this unit
    upgrades?: string[]    // upgrades that can be taken by this unit
    extraStands?: string[] // additional stands attachable to this unit (e.g. Skirmishers)
  }

  /**
   * Represents a single stand (detachment or subunit) in the army builder.
   * Derived from a schema unit, with an added count for how many are taken.
   */
  interface IArmyStand extends ISchemaUnit {
    count: number
  }

  /**
   * Represents a unit within the army builder.
   */
  interface IArmyUnit extends ISchemaUnit {
    count: number
    errors: string[]
    equippedItems: Record<string, IArmyMagicItem>
    equippedUpgrades: Record<string, IArmyUpgrade>
    addedStands: Record<string, IArmyStand>
  }
}

export {}