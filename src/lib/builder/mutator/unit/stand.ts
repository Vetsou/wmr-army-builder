import type { Writable } from 'svelte/store'
import { mutateUnit } from './internal'


export const addStand = (
  state: Writable<IBuilderState>,
  unitKey: string,
  standKey: string,
  standData: ISchemaUnit
) => {
  mutateUnit(state, unitKey, (s, unit) => {
    let unitStand = unit.addedStands[standKey]

    if (!unitStand) {
      unitStand = { ...standData, count: 0 }
      unit.addedStands[standKey] = unitStand
    }

    unitStand.count++
    s.armyCost += unitStand.points
  })
}

export const removeStand = (
  state: Writable<IBuilderState>,
  unitKey: string,
  standKey: string
) => {
  mutateUnit(state, unitKey, (s, unit) => {
    const unitStand = unit.addedStands[standKey]
    if (!unitStand) return

    unitStand.count--
    s.armyCost -= unitStand.points

    if (unitStand.count <= 0) {
      delete unit.addedStands[standKey]
    }
  })
}