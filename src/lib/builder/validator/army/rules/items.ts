import { formatError } from '$validator/internal'
import { ArmyErrors } from '../messages'


const getArmyItemCount = (
  state: IBuilderState
): Record<string, number> => {
  const itemCountMap: Record<string, number> = {}

  for (const unit of Object.values(state.units)) {
    for (const [itemKey, item] of Object.entries(unit.equippedItems)) {
      itemCountMap[itemKey] = (itemCountMap[itemKey] ?? 0) + item.count
    }
  }

  return itemCountMap
}

export const hasDuplicateMagicItem = (
  state: IBuilderState
): string[] => {
  const itemsCount = getArmyItemCount(state)
  return Object.entries(itemsCount)
    .filter(([_, count]) => count > 1)
    .map(([magicItemKey]) => formatError(ArmyErrors.duplicateMagicItem, magicItemKey))
}