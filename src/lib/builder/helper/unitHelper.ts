import { isRegiment } from './typeGuards'

export const getUnitItemCost = (
  unit: IArmyUnit,
  item: ISchemaMagicItem
): number => {
  if (typeof item.cost === 'number') return item.cost

  const statCompareValue = unit[item.stat!]?.toString() || '-'
  return item.cost[statCompareValue]
}

export const getUnitItemCount = (unit: IArmyUnit): number =>
  Object.values(unit.equippedItems).reduce((sum, item) => sum + item.count, 0)

export const getUnitUpgradesCount = (unit: IArmyUnit): number =>
  Object.values(unit.equippedUpgrades).reduce((sum, upg) => sum + upg.count, 0)

export const getUnitStandsCount = (unit: IArmyUnit): number =>
  Object.values(unit.addedStands).reduce((sum, stand) => sum + stand.count, 0)

export const getUnitBoundsString = (unit: ISchemaUnit): string =>
  unit.armyMax ? `${unit.armyMax} per army` : `${ unit.min || '-' }/${ unit.max || '-' }`

export const getUnitEquipableItems = (
  unitData: ISchemaUnit,
  magicItems: Record<string, ISchemaMagicItem>
): [string, ISchemaMagicItem][] => {
  if (isRegiment(unitData)) return []

  return Object.entries(magicItems).filter(([itemName, item]) =>
    item.allowedUnits.includes(unitData.type) || unitData.customItems?.includes(itemName))
}

export const getUnitUpgrades = (
  unitData: ISchemaUnit,
  armyUpgrades?: Record<string, ISchemaUpgrade>
): [string, ISchemaUpgrade][] => {
  return Object.entries(armyUpgrades ?? {})
    .filter(([upgradeName]) => unitData.upgrades?.includes(upgradeName))
}

export const getUnitStands = (
  unitData: ISchemaUnit,
  armyStands?: Record<string, ISchemaUnit>
): [string, ISchemaUnit][] => {
  return Object.entries(armyStands ?? {})
    .filter(([standName]) => unitData.extraStands?.includes(standName))
}