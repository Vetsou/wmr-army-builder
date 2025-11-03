import { formatError } from '$builder/validator/internal'
import { ArmyErrors } from '../messages'


const isUpgradeCountIncorrect = (
  upgrade: IArmyUpgrade,
  takenByRegiment: number, 
  armyCost: number
): boolean => {
  const countMultiplier = Math.ceil(armyCost / 1000)
  const allowedPerThousand = (upgrade.max ?? Infinity) * countMultiplier
  const upgradeCount = upgrade.count + takenByRegiment

  const exceedsPerThousand = upgradeCount > allowedPerThousand
  const exceedsArmyMax = upgradeCount > (upgrade.armyMax ?? Infinity)

  return exceedsPerThousand || exceedsArmyMax
}

const getArmyUpgradeCount = (
  state: IBuilderState
): Record<string, IArmyUpgrade> => {
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

export const isArmyUpgradeCountCorrect = (
  state: IBuilderState
): string[] => {
  const upgradeCount = getArmyUpgradeCount(state)
  return Object.entries(upgradeCount)
    .filter(([upgradeKey, upgradeData]) =>
      isUpgradeCountIncorrect(upgradeData, state.regimentCountAs.upgrades[upgradeKey], state.armyCost))
    .map(([upgradeKey, upgradeData]) =>
      formatError(
        ArmyErrors.UpgradeOutOfBounds,
        upgradeData.count + state.regimentCountAs.upgrades[upgradeKey],
        upgradeKey, upgradeData.armyMax ?? upgradeData.max ?? '-'
      ))
}