export const getUnitBoundsString = (
  unit: ISchemaUnit
): string => unit.armyMax ? `${unit.armyMax} per army` : `${ unit.min || '-' }/${ unit.max || '-' }`