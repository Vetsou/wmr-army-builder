export const isRegiment = (
  unit: ISchemaUnit
): unit is ISchemaRegiment => {
  return unit.id.charAt(0) === 'R'
}