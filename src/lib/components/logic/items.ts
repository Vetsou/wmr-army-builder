export const getUnitItemCost = (
  unit: IArmyUnit,
  item: ISchemaMagicItem
): number => {
  if (typeof item.cost === 'number') return item.cost

  // If item is not a number it has to have stat property
  const stat = item.stat as ('armor' | 'hits')
  const statCompareValue = unit[stat]?.toString() || '-'

  return item.cost[statCompareValue]
}