import { ArmyErrors } from '../messages'


export const isArmyCostExceedingLimit = (
  state: IBuilderState
): string[] => {
  return state.armyCost > state.armyCostLimit ? [ArmyErrors.armyCostExceedsLimit] : []
}