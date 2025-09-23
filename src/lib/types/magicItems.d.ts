declare global {
  /**
   * Magic item types
   */
  type MagicItemType = 'Magic Standard' | 'Magic Weapon' | 'Device of Power'
  
  /**
   * Magic items from schema
   */
  interface ISchemaMagicItem {
    type: MagicItemType
    cost: number | Record<string, number>
    stat?: 'armor' | 'hits'
    allowedUnits: UnitType[]
  }

  /**
   * Magic items added to army builder
   */
  interface IArmyMagicItem extends ISchemaMagicItem {
    costForUnit: number
    count: number
  }
}

export {}