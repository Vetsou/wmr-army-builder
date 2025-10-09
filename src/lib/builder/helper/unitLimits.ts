export const isUnitCountIncorrect = (
  unit: IArmyUnit | IArmyStand,
  armyCost: number
) => {
  const countMultiplier = Math.ceil(armyCost / 1000)
  const max = (unit.max ?? Infinity) * countMultiplier
  const min = (unit.min ?? -Infinity) * countMultiplier

  if (unit.armyMax) return unit.count > unit.armyMax
  return unit.count > max || unit.count < min
}

export const isUpgradeCountIncorrect = (
  upgrade: IArmyUpgrade,
  armyCost: number
) => {
  const countMultiplier = Math.ceil(armyCost / 1000)
  const allowedPerThousand = (upgrade.max ?? Infinity) * countMultiplier

  const exceedsPerThousand = upgrade.count > allowedPerThousand
  const exceedsArmyMax = upgrade.count > (upgrade.armyMax ?? Infinity)

  return exceedsPerThousand || exceedsArmyMax
}