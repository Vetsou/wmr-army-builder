import type { Writable } from 'svelte/store'
import { mutateUnit } from './internal'


const getUnitItemCost = (
  unit: IArmyUnit,
  item: ISchemaMagicItem
): number => {
  if (typeof item.cost === 'number') return item.cost

  // If item is not a number it has to have stat property
  const stat = item.stat as ('armor' | 'hits')
  const statCompareValue = unit[stat]?.toString() || '-'

  return item.cost[statCompareValue]
}

export const equipItem = (
  state: Writable<IBuilderState>,
  unitKey: string,
  itemKey: string,
  itemData: ISchemaMagicItem
): void => {
  mutateUnit(state, unitKey, (s, unit) => {
    const costForUnit = getUnitItemCost(unit, itemData)

    let unitItem = unit.equippedItems[itemKey]
    if (!unitItem) {
      unitItem = { ...itemData, costForUnit, count: 0 }
      unit.equippedItems[itemKey] = unitItem
    }

    unitItem.count++
    s.armyCost += costForUnit
  })
}

export const unequipItem = (
  state: Writable<IBuilderState>,
  unitKey: string,
  itemKey: string
): void => {
  mutateUnit(state, unitKey, (s, unit) => {
    const unitItem = unit.equippedItems[itemKey]

    unitItem.count--
    s.armyCost -= unitItem.costForUnit

    if (unitItem.count <= 0) delete unit.equippedItems[itemKey]
  })
}