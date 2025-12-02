import type { Writable } from 'svelte/store'
import { postMutationValidate } from './internal'


export const equipUpgrade = (
  state: Writable<IBuilderState>,
  unitKey: string,
  upgradeKey: string,
  upgradeData?: ISchemaUpgrade
): void => {
  // Impossible since it's called by button attached to upgrade component
  if (!upgradeData) return

  state.subscribe(s => {
    const preMutationArmyCost = s.armyCost

    const armyUnit = s.units[unitKey]
    if (!armyUnit) return s

    let unitUpgrade = armyUnit.equippedUpgrades[upgradeKey]

    if (!unitUpgrade) {
      unitUpgrade = { ...upgradeData, count: 0 }
      armyUnit.equippedUpgrades[upgradeKey] = unitUpgrade
    }

    unitUpgrade.count++
    s.armyCost = preMutationArmyCost + upgradeData.cost

    postMutationValidate(s, unitKey, preMutationArmyCost)
  })
}

export const unequipUpgrade = (
  state: Writable<IBuilderState>,
  unitKey: string,
  upgradeKey: string
): void => {
  state.subscribe(s => {
    const preMutationArmyCost = s.armyCost

    const armyUnit = s.units[unitKey]
    if (!armyUnit) return

    const unitUpgrade = armyUnit.equippedUpgrades[upgradeKey]
    if (!unitUpgrade) return

    unitUpgrade.count--
    s.armyCost = preMutationArmyCost - unitUpgrade.cost

    if (unitUpgrade.count <= 0) {
      delete armyUnit.equippedUpgrades[upgradeKey]
    }

    postMutationValidate(s, unitKey, preMutationArmyCost)
  })
}
