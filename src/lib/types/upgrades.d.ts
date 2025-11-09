declare global {
  /**
   * Categories of unit upgrades available in the army schema.
   */
  type UpgradeType = 'Chariot Mount' | 'Monstrous Mount' | 'Special Mount' | 'Special'

  /**
   * Base upgrade definition as stored in an army's schema file.
   */
  interface ISchemaUpgrade {
    id: string
    type: UpgradeType
    attack?: string
    range?: string
    cost: number
    max?: number
    armyMax?: number

    // Tags
    terror?: boolean
  }

  /**
   * Representation of an upgrade when added to an army within the builder.
   */
  interface IArmyUpgrade extends ISchemaUpgrade {
    count: number
  }
}

export {}