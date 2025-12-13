import type { Writable } from 'svelte/store'


declare global {
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

  interface ICountAsRegimentData {
    unitName?: string
    upgradeName?: string 
  }

  interface IBuilderState {
    armyName: string
    armyCost: Writable<number>
    armyCostLimit: Writable<number>
    units: Writable<Record<string, IArmyUnit>>
    armyErrors: Writable<string[]>
    regimentCountAs: IRegimentCountAsData
    lookup: ILookupData
  }

  interface IArmyActions {
    addUnit(unitKey: string): void
    removeUnit(unitKey: string): void

    addRegiment(unitKey: string, countAsData: ICountAsRegimentData): void
    removeRegiment(unitKey: string, countAsData: ICountAsRegimentData): void
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
    extends IBuilderState,
    IArmyActions,
    IUnitActions,
    IAugmentsActions
  {
  }
}

export {}