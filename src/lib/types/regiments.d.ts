declare global {
  /**
   * Count as rule UnitType string
   */
  type CountAsRuleType = UnitType
    | `${UnitType}|${UnitType}`
    | `${UnitType}&${UpgradeType}`
    | 'any'

  /**
   * Count as rule tags
   */
  type CountAsRuleTag = {
    unitName?: string
    mustFly?: boolean
    mustCauseTerror?: boolean
    mustBeRanged?: boolean
    requiredSize?: number
  }

  /**
   * Determines how regiment is counted within the army
   */
  type RegimentCountAsRule = {
    type?: CountAsRuleType
    tags?: CountAsRuleTag
    costType: 'highest' | 'any'
  }

  /**
   * Regiment of Renown inside schema
   */
  interface ISchemaRegiment extends ISchemaUnit {
    incompatibleWith?: string[]
    incompatibleFactions?: string[]
    countAsRules?: Record<string, RegimentCountAsRule>
  }

  /**
   * Regiment of Renown inside army builder
   */
  interface IArmyRegiment extends IArmyUnit, ISchemaRegiment {}
}

export {}