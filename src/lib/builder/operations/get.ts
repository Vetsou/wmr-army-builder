import { isRegiment } from '$builder/types/guards'


export const getAugmentsActions = (
  state: IBuilderState
): IAugmentsActions => ({
  getUnitEquipableItems: (
    unitData: ISchemaUnit
  ): [string, ISchemaMagicItem][] => {
    if (isRegiment(unitData)) return []

    return Object.entries(state.lookup.items).filter(([itemName, item]) =>
      item.allowedUnits.includes(unitData.type) || unitData.customItems?.includes(itemName))
  },

  getUnitEquipableUpgrades: (
    unitData: ISchemaUnit
  ): [string, ISchemaUpgrade][] => {
    if (isRegiment(unitData)) return []

    return Object.entries(state.lookup.upgrades ?? {})
      .filter(([upgradeName]) => unitData.upgrades?.includes(upgradeName))
  },

  getAttachableStands: (
    unitData: ISchemaUnit
  ): [string, ISchemaUnit][] => {
    if (isRegiment(unitData)) return []

    return Object.entries(state.lookup.stands ?? {})
      .filter(([standName]) => unitData.extraStands?.includes(standName))
  }
})