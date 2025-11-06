import { formatError } from '$validator/internal'
import { UnitErrors } from '../messages'


const getUnitItemCount = (
  unit: IArmyUnit
): number => Object.values(unit.equippedItems).reduce((sum, item) => sum + item.count, 0)

export const unitHasTooManyItems = (
  state: IBuilderState,
  name: string
): string[] => {
  const armyUnit = state.units[name]
  const unitItemCount = getUnitItemCount(armyUnit)
  return unitItemCount > armyUnit.count
    ? [formatError(UnitErrors.tooManyItems, armyUnit.count, name, unitItemCount)] : []
}