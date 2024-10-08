/**
 * Warmaster faction schema
 */
export interface IFaction {
  name: string
  fileName: string
}

/**
 * Warmaster army units, upgrades and rules schema
 */
export interface IArmySchema {
  name: string
  units: IBaseUnit[]
  upgrades?: IUpgrade[]
  stands?: IBaseUnit[]
}

type UnitType =
'Infantry' | 'Cavalry'   | 'Chariots' |
'Monsters' | 'Artillery' | 'Machines' |
'General'  | 'Hero'      | 'Wizard'   |
'Special'

/**
 * Base unit schema
 */
export interface IBaseUnit {
  // Description
  name: string
  id: number
  type: UnitType

  // Unit stats
  points: number
  attack: string
  size: number
  armor?: string
  hits?: number
  range?: string // Range unit
  command?: number // Commander unit

  // Unit limit
  min?: number
  max?: number
  armyMax?: number

  // Unit special stands/items refs
  upgradeRef?: number[]
  magicItemRef?: number[]
  standsRef?: number[]
}

/**
 * User added builder unit
 */
export interface IBuilderUnit extends IBaseUnit {
  count: number
  errors: string[]
  equippedItems: IBuilderMagicItem[]
  equippedUpgrades: IUpgrade[]
  additionalStands: IStandUnit[]
}

export interface IStandUnit extends IBaseUnit {
  count: number
}

/**
 * Army unit upgrade
 */

type UpgradeType = 'Chariot Mount' | 'Monstrous Mount' | 'Special Mount' | 'Special'

export interface IUpgrade {
  id: number
  name: string
  type: UpgradeType
  attackModify?: string
  range?: string
  pointsModify: number
  unitMax?: number
  armyMax?: number
}

/**
 * Magic items schema
 */

type MagicItemType = 'Magic Standard' | 'Magic Weapon' | 'Device of Power'

export interface IMagicItem {
  id: number
  name: string
  type: MagicItemType
  pointsChange: number | Record<string, number>
  compareStat?: 'armor' | 'hits'
  allowedUnits: UnitType[]
}

export interface IBuilderMagicItem extends IMagicItem {
  points: number
}