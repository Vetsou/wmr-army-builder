import { formatError, isUnitCountIncorrect } from '$validator/internal'
import { UnitErrors } from '../messages'


export const areUnitsOutOfBounds = (
  state: IBuilderState,
  name: string
): string[] => {
  const armyUnit = state.units[name]
  const takenByRegiment = state.regimentCountAs.units[name]
  const unitCount = armyUnit.count + takenByRegiment

  return isUnitCountIncorrect(armyUnit, takenByRegiment, state.armyCost)
    ? [formatError(UnitErrors.CountOutOfBounds, name, unitCount)] : []
}