export const isUnitCountIncorrect = (
  unit: IArmyUnit | IArmyStand,
  takenByRegiment: number,
  armyCost: number
) => {
  const countMultiplier = Math.ceil(armyCost / 1000)
  const max = (unit.max ?? Infinity) * countMultiplier
  const min = (unit.min ?? -Infinity) * countMultiplier
  const unitCount = unit.count + takenByRegiment

  if (unit.armyMax) return unitCount > unit.armyMax
  return unitCount > max || unitCount < min
}

export const isUpgradeCountIncorrect = (
  upgrade: IArmyUpgrade,
  takenByRegiment: number, 
  armyCost: number
) => {
  const countMultiplier = Math.ceil(armyCost / 1000)
  const allowedPerThousand = (upgrade.max ?? Infinity) * countMultiplier
  const upgradeCount = upgrade.count + takenByRegiment

  const exceedsPerThousand = upgradeCount > allowedPerThousand
  const exceedsArmyMax = upgradeCount > (upgrade.armyMax ?? Infinity)

  return exceedsPerThousand || exceedsArmyMax
}