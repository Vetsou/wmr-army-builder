import { get } from 'svelte/store'
import { postMutationValidate } from './internal'


export const addStand = (
  state: IBuilderState,
  unitKey: string,
  standKey: string,
  standData?: ISchemaUnit
): void => {
  // Impossible since it's called by button attached to stand component
  if (!standData) return

  const preMutationArmyCost = get(state.armyCost)

  const armyUnit = get(state.units)[unitKey]
  if (!armyUnit) return

  let unitStand = armyUnit.addedStands[standKey]

  if (!unitStand) {
    unitStand = { ...standData, count: 0 }
    armyUnit.addedStands[standKey] = unitStand
  }

  unitStand.count++
  state.armyCost.set(preMutationArmyCost + unitStand.points)
  postMutationValidate(state, unitKey, preMutationArmyCost)
}

export const removeStand = (
  state: IBuilderState,
  unitKey: string,
  standKey: string
): void => {
  const preMutationArmyCost = get(state.armyCost)

  const armyUnit = get(state.units)[unitKey]
  if (!armyUnit) return

  const unitStand = armyUnit.addedStands[standKey]
  if (!unitStand) return

  unitStand.count--
  state.armyCost.set(preMutationArmyCost - unitStand.points)

  if (unitStand.count <= 0) {
    delete armyUnit.addedStands[standKey]
  }

  postMutationValidate(state, unitKey, preMutationArmyCost)
}