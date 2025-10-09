declare global {
  /**
   * Faction list item
   */
  interface IFaction {
    name: string
    fileName: string
  }

  /**
   * File army schema
   */
  interface IArmySchema {
    name: string
    units: Record<string, ISchemaUnit>
    upgrades?: Record<string, ISchemaUpgrade>
    stands?: Record<string, ISchemaUnit>
  }

  /**
   * Unit types
   */
  type UnitType =
    'Infantry' | 'Cavalry'   | 'Chariots' |
    'Monsters' | 'Artillery' | 'Machines' |
    'General'  | 'Hero'      | 'Wizard'   |
    'Special'

  /**
   * Unit data inside schema
   */
  interface ISchemaUnit {
    urlId?: string
    type: UnitType

    // Unit stats
    points: number
    attack: string
    size: number
    armor?: string
    hits?: number
    range?: string // Range unit
    command?: number // Commander unit

    // Limits
    min?: number
    max?: number
    armyMax?: number

    // Unit items/upgrades/stands references
    customItems?: string[]
    upgrades?: string[]
    extraStands?: string[]
  }

  /**
   * Stand data inside army builder
   */
  interface IArmyStand extends ISchemaUnit {
    count: number
  }

  /**
   * Unit data inside army builder
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