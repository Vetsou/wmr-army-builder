declare global {
  /**
   * Types of upgrades inside schema
   */
  type UpgradeType = 'Chariot Mount' | 'Monstrous Mount' | 'Special Mount' | 'Special'

  /**
   * Army upgrade inside schema file
   */
  interface ISchemaUpgrade {
    type: UpgradeType
    attack?: string
    range?: string
    cost: number
    max?: number
    armyMax?: number
  }

  /**
   * Army upgrade inside army builder
   */
  interface IArmyUpgrade extends ISchemaUpgrade {
    count: number
  }
}

export {}