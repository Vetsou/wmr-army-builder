import type { IBuilderState } from '$builder/store'

export interface UnitRule {
  check(state: IBuilderState, unitName: string): string[]
}

export interface ArmyRule {
  check(state: IBuilderState): string[]
}