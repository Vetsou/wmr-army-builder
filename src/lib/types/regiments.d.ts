declare global {
  /**
   * Defines how a Regiment of Renown is counted toward army composition limits.
   *
   * Each Regiment "counts as" one of the following:
   * - A specific `UnitType` (e.g., 'Infantry', 'Cavalry', 'Hero').
   * - A combination of two unit types separated by `|` (e.g., 'Cavalry|Chariots'),
   *   meaning it counts as either of those.
   * - A combination of a unit type and an upgrade type separated by `&`
   *   (e.g., 'Hero&Monstrous Mount'), meaning it counts as both.
   * - `'any'`, meaning it does not restrict any unit type.
   */
  type CountAsRuleType = UnitType
    | `${UnitType}|${UnitType}`
    | `${UnitType}&${UpgradeType}`
    | 'any'

  /**
   * Optional filters and conditions applied to a Regiment's CountAs rule.
   * Used to fine-tune what kind of unit the Regiment replaces or counts toward.
   */
  type CountAsRuleTag = {
    unitName?: string
    mustFly?: boolean
    mustCauseTerror?: boolean
    mustBeRanged?: boolean
    requiredSize?: number
  }

  /**
   * A "count as" rule defines how a Regiment of Renown affects the
   * hiring army’s unit allowance for each 1000 points.
   *
   * Example:
   * - `{ type: 'Infantry', costType: 'highest' }` -> counts as one highest-cost Infantry unit.
   */
  type RegimentCountAsRule = {
    type?: CountAsRuleType
    tags?: CountAsRuleTag
    costType: 'highest' | 'any'
  }

  /**
   * Regiment of Renown schema definition.
   */
  interface ISchemaRegiment extends ISchemaUnit {
    incompatibleWith?: string[]
    incompatibleFactions?: string[]
    countAsRules?: Record<string, RegimentCountAsRule>
  }

  /**
   * Regiment of Renown as used inside the army builder context.
   */
  interface IArmyRegiment extends IArmyUnit, ISchemaRegiment {
    countAsUnit?: string
    countAsUpgrade?: string
  }
}

export {}