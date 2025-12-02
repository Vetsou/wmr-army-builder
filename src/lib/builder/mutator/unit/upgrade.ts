import { get } from 'svelte/store'
import { postMutationValidate } from './internal'


export const equipUpgrade = (
  state: IBuilderState,
  unitKey: string,
  upgradeKey: string,
  upgradeData?: ISchemaUpgrade
): void => {
  // Impossible since it's called by button attached to upgrade component
  if (!upgradeData) return

  const preMutationArmyCost = get(state.armyCost)

  const armyUnit = get(state.units)[unitKey]
  if (!armyUnit) return

  let unitUpgrade = armyUnit.equippedUpgrades[upgradeKey]

  if (!unitUpgrade) {
    unitUpgrade = { ...upgradeData, count: 0 }
    armyUnit.equippedUpgrades[upgradeKey] = unitUpgrade
  }

  unitUpgrade.count++
  state.armyCost.set(preMutationArmyCost + upgradeData.cost)

  postMutationValidate(state, unitKey, preMutationArmyCost)
}

export const unequipUpgrade = (
  state: IBuilderState,
  unitKey: string,
  upgradeKey: string
): void => {
  const preMutationArmyCost = get(state.armyCost)

  const armyUnit = get(state.units)[unitKey]
  if (!armyUnit) return

  const unitUpgrade = armyUnit.equippedUpgrades[upgradeKey]
  if (!unitUpgrade) return

  unitUpgrade.count--
  state.armyCost.set(preMutationArmyCost - unitUpgrade.cost)

  if (unitUpgrade.count <= 0) {
    delete armyUnit.equippedUpgrades[upgradeKey]
  }

  postMutationValidate(state, unitKey, preMutationArmyCost)
}
