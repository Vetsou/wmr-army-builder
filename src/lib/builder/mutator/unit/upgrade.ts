import type { Writable } from 'svelte/store'
import { mutateUnit } from './internal'


export const equipUpgrade = (
  state: Writable<IBuilderState>,
  unitKey: string,
  upgradeKey: string,
  upgradeData: ISchemaUpgrade
) => {
  mutateUnit(state, unitKey, (s, unit) => {
    let unitUpgrade = unit.equippedUpgrades[upgradeKey]

    if (!unitUpgrade) {
      unitUpgrade = { ...upgradeData, count: 0 }
      unit.equippedUpgrades[upgradeKey] = unitUpgrade
    }

    unitUpgrade.count++
    s.armyCost += upgradeData.cost
  })
}

export const unequipUpgrade = (
  state: Writable<IBuilderState>,
  unitKey: string,
  upgradeKey: string
) => {
  mutateUnit(state, unitKey, (s, unit) => {
    const unitUpgrade = unit.equippedUpgrades[upgradeKey]
    if (!unitUpgrade) return

    unitUpgrade.count--
    s.armyCost -= unitUpgrade.cost

    if (unitUpgrade.count <= 0) {
      delete unit.equippedUpgrades[upgradeKey]
    }
  })
}
