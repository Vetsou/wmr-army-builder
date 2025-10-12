
export enum UnitErrors {
  CountOutOfBounds = '{0} count of {1} is out of bounds.',
  TooManyItems = '{0} {1} cannot have {2} item(s).',
  TooManyUpgrades = '{0} {1} cannot have {2} upgrade(s).',
  TooManyStands = '{0} {1} cannot have {2} stand(s).'
}

export enum ArmyErrors {
  ArmyCostExceedsLimit = 'Army cost exceeds the limit.',
  ArmyNeedsGeneral = 'Army needs a general.',
  DuplicateMagicItem = 'Cannot have more than 1 {0}.',
  StandOutOfBounds = '{0} count of {1} is out of bounds.',
  UpgradeOutOfBounds = 'You cannot have {0} {1} upgrade(s). Max is {2}.',
  IncompatibleRegiments = '{0} and {1} regiments cannot fight together',
  TooManyRegiments = 'Too many Regiments of Renown (Count {0} max is {1})'
}

type ErrFormatArg = string | number

export const formatError = (
  format: string,
  ...args: ErrFormatArg[]
): string => {
  return format.replace(/{(\d+)}/g, (_, i) => String(args[Number(i)] ?? ''))
}