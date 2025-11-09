declare global {
  /**
   * Categories of magic items available in an army list.
   */
  type MagicItemType = 'Magic Standard' | 'Magic Weapon' | 'Device of Power'
  
  /**
   * Schema definition for a magic item as it appears in army data files.
   */
  interface ISchemaMagicItem {
    id: string
    type: MagicItemType

    /**
     * Cost of the magic item.
     * - Can be a flat number (same cost for all units),
     * - Or a record mapping unit stats (like armor or hits) to specific costs.
     */
    cost: number | Record<string, number>
    stat?: 'armor' | 'hits'
    allowedUnits: UnitType[]
  }

  /**
   * Representation of a magic item when added to an army in the builder.
   * Includes the resolved cost and selection count.
   */
  interface IArmyMagicItem extends ISchemaMagicItem {
    costForUnit: number
    count: number
  }
}

export {}