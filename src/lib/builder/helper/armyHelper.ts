import type { IBuilderState } from '$builder/store'

export const getArmyItemCount = (state: IBuilderState) => {
  const itemCountMap: Record<string, number> = {}

  for (const unit of Object.values(state.units)) {
    for (const [itemKey, item] of Object.entries(unit.equippedItems)) {
      itemCountMap[itemKey] = (itemCountMap[itemKey] ?? 0) + item.count
    }
  }

  return itemCountMap
}

export const getArmyStandsCount = (state: IBuilderState): Record<string, IArmyStand> => {
  const standCountMap: Record<string, IArmyStand> = {}

  for (const unit of Object.values(state.units)) {
    for (const [standKey, stand] of Object.entries(unit.addedStands)) {
      if (!standCountMap[standKey]) {
        standCountMap[standKey] = { ...stand, count: 0 }
      }

      standCountMap[standKey].count += stand.count
    }
  }

  return standCountMap
}

export const getArmyUpgradeCount = (state: IBuilderState) => {
  const upgradeCountMap: Record<string, IArmyUpgrade> = {}

  for (const unit of Object.values(state.units)) {
    for (const [upgradeKey, upgrade] of Object.entries(unit.equippedUpgrades)) {
      if (!upgradeCountMap[upgradeKey]) {
        upgradeCountMap[upgradeKey] = { ...upgrade, count: 0 }
      }

      upgradeCountMap[upgradeKey].count += upgrade.count
    }
  }

  return upgradeCountMap
}