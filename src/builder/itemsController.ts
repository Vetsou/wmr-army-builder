import type { IBaseUnit, IBuilderMagicItem, IMagicItem } from '$types/Schema'
import type { Writable } from 'svelte/store'
import type { IBuilderState } from './store'
import { getItemCostForUnit } from '../utils'

import * as Validator from './validator'

export const equipItem =
(state: Writable<IBuilderState>, unit: IBaseUnit, itemData: IMagicItem) => {
  state.update(s => {
    const builderUnit = s.units.find(u => u.id === unit.id)
    if (!builderUnit) return s

    const newItem: IBuilderMagicItem = { 
      ...itemData,
      points: getItemCostForUnit(unit, itemData) 
    }

    builderUnit.equippedItems.push(newItem)
    s.armyCost += newItem.points

    Validator.validateUnit(builderUnit)
    Validator.validateArmy(s)
    return s
  })
}

export const unequipItem =
(state: Writable<IBuilderState>, unit: IBaseUnit, itemIdx: number) => {
  state.update(s => {
    const builderUnit = s.units.find(u => u.id === unit.id)
    if (!builderUnit) return s

    const removedItem = builderUnit.equippedItems.splice(itemIdx, 1)[0]
    s.armyCost -= removedItem.points

    Validator.validateUnit(builderUnit)
    Validator.validateArmy(s)
    return s
  })
}