import type { Writable } from 'svelte/store'
import { postMutationValidate } from './internal'


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
  state.update(s => {
    const preMutationArmyCost = s.armyCost

    const armyUnit = s.units[unitKey]
    if (!armyUnit) return s

    const costForUnit = getUnitItemCost(armyUnit, itemData)

    let unitItem = armyUnit.equippedItems[itemKey]
    if (!unitItem) {
      unitItem = { ...itemData, costForUnit, count: 0 }
      armyUnit.equippedItems[itemKey] = unitItem
    }

    unitItem.count++
    s.armyCost = preMutationArmyCost + costForUnit
    postMutationValidate(s, unitKey, preMutationArmyCost)

    return s
  })
}

export const unequipItem = (
  state: Writable<IBuilderState>,
  unitKey: string,
  itemKey: string
): void => {
  state.update(s => {
    const preMutationArmyCost = s.armyCost

    const armyUnit = s.units[unitKey]
    if (!armyUnit) return s

    const unitItem = armyUnit.equippedItems[itemKey]

    unitItem.count--
    s.armyCost = preMutationArmyCost - unitItem.costForUnit

    if (unitItem.count <= 0) delete armyUnit.equippedItems[itemKey]
    postMutationValidate(s, unitKey, preMutationArmyCost)

    return s
  })
}