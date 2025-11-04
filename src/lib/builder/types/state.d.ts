interface ILookupData {
  readonly magicItems: Record<string, ISchemaMagicItem>
  readonly armyUpgrades?: Record<string, ISchemaUpgrade>
  readonly armyStands?: Record<string, ISchemaUnit>
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

  interface IBuilderStore {
    // Svelte store
    subscribe: Writable<IBuilderState>['subscribe']
    getState(): IBuilderState

    // Army actions
    initNewArmy(armySchema: IArmySchema, magicItems: Record<string, ISchemaMagicItem>): void
    addUnit(unitKey: string, unitData: ISchemaUnit): void
    removeUnit(unitKey: string, unitData: IArmyUnit): void
    addRegiment(unitKey: string, unitData: ISchemaRegiment, countAsData: IAddRegimentData): void

    // Unit actions
    equipItem(unitKey: string, itemKey: string, itemData: ISchemaMagicItem): void
    unequipItem(unitKey: string, itemKey: string): void
    equipUpgrade(unitKey: string, upgradeKey: string, upgradeData: ISchemaUpgrade): void
    unequipUpgrade(unitKey: string, upgradeKey: string): void
    addStand(unitKey: string, standKey: string, standData: ISchemaUnit): void
    removeStand(unitKey: string, standKey: string): void
  }
}

export {}