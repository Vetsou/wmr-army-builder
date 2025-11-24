import type { Readable } from 'svelte/store'


interface ILookupData {
  readonly items: Record<string, ISchemaMagicItem>
  readonly regiments: Record<string, ISchemaRegiment>
  readonly units: Record<string, ISchemaUnit>
  readonly upgrades?: Record<string, ISchemaUpgrade>
  readonly stands?: Record<string, ISchemaUnit>
}

interface IRegimentCountAsData {
  units: Record<string, number>
  upgrades: Record<string, number>
}

declare global {
  interface IAddRegimentData {
    unitName?: string
    upgradeName?: string 
  }
    
  interface IBuilderState {
    armyName: string
    armyCost: number
    armyCostLimit: number
    units: Record<string, IArmyUnit>
    armyErrors: string[]
    regimentCountAs: IRegimentCountAsData
    lookup: ILookupData
  }

  interface IArmyActions {
    initNewArmy(
      armySchema: IArmySchema,
      items: Record<string, ISchemaMagicItem>,
      regiments: Record<string, ISchemaRegiment>
    ): void

    addUnit(unitKey: string): void
    removeUnit(unitKey: string): void
    addRegiment(unitKey: string, countAsData: IAddRegimentData): void
  }

  interface IUnitActions {
    equipItem(unitKey: string, itemKey: string): void
    unequipItem(unitKey: string, itemKey: string): void

    equipUpgrade(unitKey: string, upgradeKey: string): void
    unequipUpgrade(unitKey: string, upgradeKey: string): void

    addStand(unitKey: string, standKey: string): void
    removeStand(unitKey: string, standKey: string): void
  }

  interface IAugmentsActions {
    getUnitEquipableItems(unitData: ISchemaUnit): [string, ISchemaMagicItem][]
    getUnitEquipableUpgrades(unitData: ISchemaUnit): [string, ISchemaUpgrade][]
    getAttachableStands(unitData: ISchemaUnit): [string, ISchemaUnit][]
  }

  interface IBuilderStore 
    extends Readable<IBuilderState>,
    IArmyActions,
    IUnitActions,
    IAugmentsActions
  {
    getState(): IBuilderState
  }
}

export {}