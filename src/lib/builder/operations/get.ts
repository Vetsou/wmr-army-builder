import { get, type Writable } from 'svelte/store'
import { isRegiment } from '$builder/types/guards'


export const getAugmentsActions = (
  state: Writable<IBuilderState>
): IAugmentsActions => ({
  getUnitEquipableItems: (
    unitData: ISchemaUnit
  ): [string, ISchemaMagicItem][] => {
    if (isRegiment(unitData)) return []

    const data = get(state)
    return Object.entries(data.lookup.items).filter(([itemName, item]) =>
      item.allowedUnits.includes(unitData.type) || unitData.customItems?.includes(itemName))
  },

  getUnitEquipableUpgrades: (
    unitData: ISchemaUnit
  ): [string, ISchemaUpgrade][] => {
    if (isRegiment(unitData)) return []

    const data = get(state)
    return Object.entries(data.lookup.upgrades ?? {})
      .filter(([upgradeName]) => unitData.upgrades?.includes(upgradeName))
  },

  getAttachableStands: (
    unitData: ISchemaUnit
  ): [string, ISchemaUnit][] => {
    if (isRegiment(unitData)) return []

    const data = get(state)
    return Object.entries(data.lookup.stands ?? {})
      .filter(([standName]) => unitData.extraStands?.includes(standName))
  }
})