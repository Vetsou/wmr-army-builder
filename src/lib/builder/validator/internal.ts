type ErrFormatArg = string | number

export const formatError = (
  format: string,
  ...args: ErrFormatArg[]
): string => {
  return format.replace(/{(\d+)}/g, (_, i) => String(args[Number(i)] ?? ''))
}

export const isUnitCountIncorrect = (
  unit: IArmyUnit | IArmyStand,
  takenByRegiments: number,
  armyCost: number
) => {
  const countMultiplier = Math.ceil(armyCost / 1000)
  const max = (unit.max ?? Infinity) * countMultiplier
  const min = (unit.min ?? -Infinity) * countMultiplier
  const unitCount = unit.count + takenByRegiments

  if (unit.armyMax) return unitCount > unit.armyMax
  return unitCount > max || unitCount < min
}