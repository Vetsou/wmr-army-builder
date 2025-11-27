export const isRegiment = (
  unit: ISchemaUnit
): unit is ISchemaRegiment | IArmyRegiment => {
  return unit.id.charAt(0) === 'R'
}