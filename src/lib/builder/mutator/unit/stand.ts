import type { Writable } from 'svelte/store'
import { postMutationValidate } from './internal'


export const addStand = (
  state: Writable<IBuilderState>,
  unitKey: string,
  standKey: string,
  standData?: ISchemaUnit
): void => {
  // Impossible since it's called by button attached to stand component
  if (!standData) return

  state.update(s => {
    const preMutationArmyCost = s.armyCost

    const armyUnit = s.units[unitKey]
    if (!armyUnit) return s

    let unitStand = armyUnit.addedStands[standKey]

    if (!unitStand) {
      unitStand = { ...standData, count: 0 }
      armyUnit.addedStands[standKey] = unitStand
    }

    unitStand.count++
    s.armyCost = preMutationArmyCost + unitStand.points
    postMutationValidate(s, unitKey, preMutationArmyCost)

    return s
  })
}

export const removeStand = (
  state: Writable<IBuilderState>,
  unitKey: string,
  standKey: string
): void => {
  state.update(s => {
    const preMutationArmyCost = s.armyCost

    const armyUnit = s.units[unitKey]
    if (!armyUnit) return s

    const unitStand = armyUnit.addedStands[standKey]
    if (!unitStand) return s

    unitStand.count--
    s.armyCost = preMutationArmyCost - unitStand.points

    if (unitStand.count <= 0) {
      delete armyUnit.addedStands[standKey]
    }

    postMutationValidate(s, unitKey, preMutationArmyCost)
    return s
  })
}