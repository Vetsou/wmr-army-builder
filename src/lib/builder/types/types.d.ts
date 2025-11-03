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
  interface IBuilderState {
    armyName: string
    armyCost: number
    armyCostLimit: number
    units: Record<string, IArmyUnit>
    armyErrors: string[]
    regimentCountAs: IRegimentCountAsData
    lookup: ILookupData
  }
}

export {}