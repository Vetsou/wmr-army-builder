const filterByType = (
  state: IBuilderState,
  result: CountAsRuleResult,
  type: CountAsRuleType
): CountAsRuleResult => {
  if (type === 'any') return { units: result.units, upgrades: [] }

  const hasOr = type.includes('|')
  if (hasOr) {
    const unitTypes = type.split('|').map(t => t.trim())
    return {
      units: result.units.filter(([_, u]) => unitTypes.includes(u.type)),
      upgrades: []
    }
  }

  const hasAnd = type.includes('&')
  if (hasAnd) {
    const [unitType, upgradeType] = type
      .split('&')
      .map(t => t.trim()) as [UnitType, UpgradeType]

    return {
      units: result.units.filter(([_, u]) => unitType.includes(u.type)),
      upgrades: Object.entries(state.lookup.armyUpgrades ?? {}).filter(([_, upg]) => upgradeType.includes(upg.type))
    }
  }

  return {
    units: result.units.filter(([_, u]) => u.type === type as UnitType),
    upgrades: []
  }
}

const filterUnitsByTags = (
  units: [string, ISchemaUnit][],
  rule: RegimentCountAsRule
): [string, ISchemaUnit][] => {
  const highestCost = rule.costType === 'highest'
    ? Math.max(...units.map(([_, u]) => u.points))
    : null

  return units.filter(([_, u]) => {
    if (rule.tags?.mustFly && !u.flying) return false
    if (rule.tags?.mustBeRanged && u.range === undefined) return false
    if (rule.tags?.requiredSize && u.size !== rule.tags.requiredSize) return false
    if (rule.costType === 'highest' && u.points !== highestCost) return false
    return true
  })
}

const filterUpgradesByTags = (
  upgrades: [string, ISchemaUpgrade][],
  rule: RegimentCountAsRule
): [string, ISchemaUpgrade][] => {
  return upgrades.filter(([_, upg]) => {
    if (rule.tags?.mustCauseTerror && !upg.terror) return false
    return true
  })
}

export const getRegimentCountAsRuleUnits = (
  state: IBuilderState,
  schemaUnits: Record<string, ISchemaUnit>,
  regiment: ISchemaRegiment
): CountAsRuleResult => {
  if (!regiment.countAsRules) return { units: [], upgrades: [] }

  const countAsRule = regiment.countAsRules[state.armyName] ?? regiment.countAsRules.any

  let result: CountAsRuleResult = {
    units: Object.entries(schemaUnits).filter(([_, u]) => u.max || u.armyMax),
    upgrades: []
  }

  // Rule should always have type or unitName
  if (countAsRule.tags?.unitName) {
    result.units = result.units.filter(([name, _]) => name === countAsRule.tags?.unitName)
  } else if (countAsRule.type !== 'any') {
    result = filterByType(state, result, countAsRule.type!)
  }

  return {
    units: filterUnitsByTags(result.units, countAsRule),
    upgrades: filterUpgradesByTags(result.upgrades, countAsRule)
  }
}