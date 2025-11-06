declare global {
  type CountAsRuleResult = {
    units: [string, ISchemaUnit][]
    upgrades: [string, ISchemaUpgrade][]
  }
}

export {}