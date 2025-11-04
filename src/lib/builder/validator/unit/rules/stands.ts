import { formatError } from '$validator/internal'
import { UnitErrors } from '../messages'


const getUnitStandsCount = (
  unit: IArmyUnit
): number => Object.values(unit.addedStands).reduce((sum, stand) => sum + stand.count, 0)

export const areStandsOutOfBounds = (
  state: IBuilderState,
  name: string
): string[] => {
  const armyUnit = state.units[name]
  const unitStandCount = getUnitStandsCount(armyUnit)
  return unitStandCount > armyUnit.count
    ? [formatError(UnitErrors.TooManyStands, armyUnit.count, name, unitStandCount)] : []
}