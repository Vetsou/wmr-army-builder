import { ArmyErrors } from '../messages'


export const hasGeneral = (
  state: IBuilderState
): string[] => {
  const hasGeneral = Object.values(state.units).some(u => u.type === 'General')
  return hasGeneral === false ? [ArmyErrors.ArmyNeedsGeneral] : []
}