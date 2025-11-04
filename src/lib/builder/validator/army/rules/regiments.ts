import { isRegiment } from '$builder/types/guards'
import { formatError } from '$validator/internal'
import { ArmyErrors } from '../messages'


export const hasIncompatibleRegiments = (
  state: IBuilderState
): string[] => {
  const regiments = new Map<string, IArmyRegiment>()
  const errors: string[] = []

  for (const [name, unit] of Object.entries(state.units)) {
    if (isRegiment(unit)) regiments.set(name, unit)
  }

  for (const [name, regiment] of regiments) {
    const incompatibleUnits = regiment.incompatibleWith
    if (!incompatibleUnits) continue

    for (const badUnitName of incompatibleUnits) {
      if (badUnitName.startsWith('(')) {
        const endIdx = badUnitName.indexOf(')')

        if (endIdx !== -1) {
          const armyName = badUnitName.slice(1, endIdx).trim()
          const unitName = badUnitName.slice(endIdx + 1).trim()

          if (state.armyName === armyName && state.units[unitName]) {
            errors.push(formatError(ArmyErrors.incompatibleRegiments, name, unitName))
          }

          continue // Skip standard check
        }
      }

      if (regiments.has(badUnitName)) {
        errors.push(formatError(ArmyErrors.incompatibleRegiments, name, badUnitName))
      }
    }
  }

  return errors
}