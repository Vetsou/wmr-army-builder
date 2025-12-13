import { get } from 'svelte/store'
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
  state: IBuilderState,
  unitKey: string,
  itemKey: string,
  itemData: ISchemaMagicItem
): void => {
  const preMutationArmyCost = get(state.armyCost)

  const armyUnit = get(state.units)[unitKey]
  if (!armyUnit) return

  const costForUnit = getUnitItemCost(armyUnit, itemData)

  let unitItem = armyUnit.equippedItems[itemKey]
  if (!unitItem) {
    unitItem = { ...itemData, costForUnit, count: 0 }
    armyUnit.equippedItems[itemKey] = unitItem
  }

  unitItem.count++
  state.armyCost.set(preMutationArmyCost + costForUnit)
  postMutationValidate(state, unitKey, preMutationArmyCost)
}

export const unequipItem = (
  state: IBuilderState,
  unitKey: string,
  itemKey: string
): void => {
  const preMutationArmyCost = get(state.armyCost)

  const armyUnit = get(state.units)[unitKey]
  if (!armyUnit) return

  const unitItem = armyUnit.equippedItems[itemKey]

  unitItem.count--
  state.armyCost.set(preMutationArmyCost - unitItem.costForUnit)

  if (unitItem.count <= 0) delete armyUnit.equippedItems[itemKey]
  postMutationValidate(state, unitKey, preMutationArmyCost)
}