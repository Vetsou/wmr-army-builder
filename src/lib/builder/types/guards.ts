export const isRegiment = (
  unit: ISchemaUnit
): unit is ISchemaRegiment => {
  return 'urlId' in unit && unit.urlId?.charAt(0) === 'R'
}