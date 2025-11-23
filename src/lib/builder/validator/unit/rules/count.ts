import { isRegiment } from '$builder/types/guards'
import { formatError, isUnitCountIncorrect } from '$validator/internal'
import { UnitErrors } from '../messages'


export const areUnitsOutOfBounds = (
  state: IBuilderState,
  name: string
): string[] => {
  const armyUnit = state.units[name]
  const takenByRegiment = isRegiment(armyUnit) ? 0 : state.regimentCountAs.units[name]
  const unitCount = armyUnit.count + takenByRegiment

  return isUnitCountIncorrect(armyUnit, takenByRegiment, state.armyCost)
    ? [formatError(UnitErrors.countOutOfBounds, name, unitCount)] : []
}