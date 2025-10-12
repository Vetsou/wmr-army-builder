declare global {
  /**
   * Regiment of Renown inside schema
   */
  interface ISchemaRegiment extends ISchemaUnit {
    incompatibleWith?: string[]
    incompatibleFactions?: string[]
  }

  /**
   * Regiment of Renown inside army builder
   */
  interface IArmyRegiment extends IArmyUnit, ISchemaRegiment {}
}

export {}