import * as UnitValidator from '$validator/unit'
import * as ArmyValidator from '$validator/army'


export const postMutationValidate = (
  state: IBuilderState,
  unitKey: string,
  preMutationArmyCost: number
): void => {
  UnitValidator.validateUnit(state, unitKey)
  ArmyValidator.validateArmy(state, preMutationArmyCost)
}