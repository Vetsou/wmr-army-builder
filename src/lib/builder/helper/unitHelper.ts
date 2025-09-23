
export const getUnitItemCost = (
  unit: IArmyUnit,
  item: ISchemaMagicItem
): number => {
  if (typeof item.cost === 'number') return item.cost

  const statCompareValue = unit[item.stat!]?.toString() || '-'
  return item.cost[statCompareValue]
}

export const isUnitCountIncorrect = (
  unit: IArmyUnit | IArmyStand,
  armyCost: number
) => {
  const countMultiplier = Math.ceil(armyCost / 1000)
  const max = (unit.max ?? Infinity) * countMultiplier
  const min = (unit.min ?? -Infinity) * countMultiplier

  if (unit.armyMax) return unit.count > unit.armyMax
  return unit.count > max || unit.count < min
}

export const isUpgradeCountIncorrect = (
  upgrade: IArmyUpgrade,
  armyCost: number
) => {
  const countMultiplier = Math.ceil(armyCost / 1000)
  const allowedPerThousand = (upgrade.max ?? Infinity) * countMultiplier

  const exceedsPerThousand = upgrade.count > allowedPerThousand
  const exceedsArmyMax = upgrade.count > (upgrade.armyMax ?? Infinity)

  return exceedsPerThousand || exceedsArmyMax
}

export const getUnitItemCount = (unit: IArmyUnit): number =>
  Object.values(unit.equippedItems).reduce((sum, item) => sum + item.count, 0)

export const getUnitUpgradesCount = (unit: IArmyUnit): number =>
  Object.values(unit.equippedUpgrades).reduce((sum, upg) => sum + upg.count, 0)

export const getUnitStandsCount = (unit: IArmyUnit): number =>
  Object.values(unit.addedStands).reduce((sum, stand) => sum + stand.count, 0)

export const getUnitBoundsString =
(unit: ISchemaUnit): string =>
  unit.armyMax ? `${unit.armyMax} per army` : `${ unit.min || '-' }/${ unit.max || '-' }`