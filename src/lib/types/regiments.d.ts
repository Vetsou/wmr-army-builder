declare global {
  /**
   * Regiment of Renown inside schema
   */
  interface ISchemaRegiment extends ISchemaUnit {
    incompatibleWith?: string[]
    incompatibleFactions?: string[]
  }
}

export {}