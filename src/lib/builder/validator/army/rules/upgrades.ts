import type { ArmyRulePayload } from '..'

import { formatError } from '$validator/internal'
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
  payload: ArmyRulePayload
): Record<string, IArmyUpgrade> => {
  const upgradeCountMap: Record<string, IArmyUpgrade> = {}

  for (const unit of Object.values(payload.armyUnits)) {
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
  payload: ArmyRulePayload
): string[] => {
  const upgradeCount = getArmyUpgradeCount(payload)
  return Object.entries(upgradeCount)
    .filter(([upgradeKey, upgradeData]) =>
      isUpgradeCountIncorrect(upgradeData, payload.regimentsCountAs.upgrades[upgradeKey], payload.armyCost))
    .map(([upgradeKey, upgradeData]) =>
      formatError(
        ArmyErrors.upgradeOutOfBounds,
        upgradeData.count + payload.regimentsCountAs.upgrades[upgradeKey],
        upgradeKey, upgradeData.armyMax ?? upgradeData.max ?? '-'
      ))
}