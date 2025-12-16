import { get, type Writable } from 'svelte/store'
import { isRegiment } from '../types/guards'

import * as ArmyMutator from '$builder/mutator/army'
import * as UnitMutator from '$builder/mutator/unit'


type DecodedCountAsEntry = {
  unitName?: string
  upgradeName?: string
  count: number
}

const decodeCountAsEntriesFromUrl = (
  schemaUnits: [string, ISchemaUnit][],
  schemaUpgrades: [string, ISchemaUpgrade][],
  unitGroup?: string,
  upgradeGroup?: string
): DecodedCountAsEntry[] => {
  const entries: DecodedCountAsEntry[] = []

  if (unitGroup) {
    for (const token of unitGroup.split(',')) {
      const [id, countStr] = token.split('x')
      const count = countStr ? parseInt(countStr, 10) : 1

      const match = schemaUnits.find(([, u]) => u.id === id)
      if (!match) continue

      entries.push({ unitName: match[0], count })
    }
  }

  if (upgradeGroup) {
    for (const token of upgradeGroup.split(',')) {
      const [id, countStr] = token.split('x')
      const count = countStr ? parseInt(countStr, 10) : 1

      const match = schemaUpgrades.find(([, u]) => u.id === id)
      if (!match) continue

      entries.push({ upgradeName: match[0], count })
    }
  }

  return entries
}

const getEncodedAttachments = (
  unit: IArmyUnit
): string => {
  if (isRegiment(unit)) return ''

  const attachments: string[] = []

  Object.entries(unit.equippedUpgrades).forEach(([_, upg]) => {
    attachments.push(upg.count > 1 ? `${upg.id}x${upg.count}` : upg.id)
  })

  Object.entries(unit.equippedItems).forEach(([_, item]) => {
    attachments.push(item.count > 1 ? `${item.id}x${item.count}` : item.id)
  })

  Object.entries(unit.addedStands).forEach(([_, stand]) => {
    attachments.push(stand.count > 1 ? `${stand.id}x${stand.count}` : stand.id)
  })

  return attachments.length > 0 ? `[${attachments.join(',')}]` : ''
}

const getEncodedRegimentCountAs = (
  lookup: ILookupData,
  unit: IArmyUnit
): string => {
  if (!isRegiment(unit)) return ''

  const caUnits = Object.entries(unit.countAsUnits)
  const caUpgrades = Object.entries(unit.countAsUpgrades)

  if (caUnits.length === 0 && caUpgrades.length === 0) return ''

  const encodedUnits = caUnits
    .map(([unitName, count]) => {
      const schemaUnit = lookup.units?.[unitName]
      if (!schemaUnit) return null

      return count > 1 ? `${schemaUnit.id}x${count}` : schemaUnit.id
    })
    .filter(Boolean)
    .join(',')

  const encodedUpgrades = caUpgrades
    .map(([upgradeName, count]) => {
      const schemaUpgrade = lookup.upgrades?.[upgradeName]
      if (!schemaUpgrade) return null

      return count > 1 ? `${schemaUpgrade.id}x${count}` : schemaUpgrade.id
    })
    .filter(Boolean)
    .join(',')

  return encodedUpgrades === '' ? `(${encodedUnits})` : `(${encodedUnits}/${encodedUpgrades})`
}

export const encodeArmyToUrl = (
  unitsState: Writable<Record<string, IArmyUnit>>,
  lookup: ILookupData
): string => {
  const params = new URLSearchParams()
  const units = Object.entries(get(unitsState))

  for (const [_, unit] of units) {
    const attachmentsStr = getEncodedAttachments(unit)
    const caStr = getEncodedRegimentCountAs(lookup, unit)

    /**
     * Encode string like this: 3(U1/UPG3)[UPG1,MI2x2]
     * '3' - Unit count
     * '(U1/UPG3)' - Regiment count as data could also be '(CA=U1)' if only unit is encoded
     * '[UPG1,MI2x2]' - Unit items/upgrades/stands
     */
    params.set(unit.id, `${unit.count}${caStr}${attachmentsStr}`)
  }

  return params.toString()
}

export const decodeArmyFromUrl = (
  state: IBuilderState,
  urlParams: Record<string, string>
): void => {
  const schemaRegiments = Object.entries(state.lookup.regiments)
  const schemaUnits = Object.entries(state.lookup.units)

  const schemaUpgrades = Object.entries(state.lookup.upgrades ?? {})
  const schemaStands = Object.entries(state.lookup.stands ?? {})
  const schemaItems = Object.entries(state.lookup.items)

  for (const [unitId, value] of Object.entries(urlParams)) {
    const parsedValue = decodeURIComponent(value)

    /**
     * Param entries should be like:
     *   "U1=3", "U3=2[UPG1,MI2x2]", "R1=1(U1)"
     */
    const match = parsedValue.match(/^(\d+)(?:\(([^\/\)]*)(?:\/([^\)]*))?\))?(?:\[([^\]]*)\])?$/)
    if (!match) continue

    // Regex groups
    const unitCount = parseInt(match[1], 10)
    const attachments = match[4] ? match[4].split(',') : []

    const caUnitIds = match[2]
    const caUpgradeIds = match[3]

    const isRegiment = unitId.startsWith('R')
    const isUnit = unitId.startsWith('U')

    // If ID is not from unit or regiment then it's invalid
    if (!isRegiment && !isUnit) continue

    const schemaEntry = isRegiment
      ? schemaRegiments.find(([_, r]) => r.id === unitId)
      : schemaUnits.find(([_, u]) => u.id === unitId)

    // If we can't find the unit then it's invalid
    if (!schemaEntry) continue

    const [schemaKey, schemaData] = schemaEntry

    if (isUnit) {
      ArmyMutator.addUnit(state, schemaKey, schemaData, unitCount)
    } else {
      const decodedCaEntries = decodeCountAsEntriesFromUrl(schemaUnits, schemaUpgrades, caUnitIds, caUpgradeIds)
      if (decodedCaEntries.length <= 0) continue

      for (const entry of decodedCaEntries) {
        ArmyMutator.addRegiment(
          state,
          schemaKey,
          schemaData,
          {
            unitName: entry.unitName,
            upgradeName: entry.upgradeName
          },
          entry.count
        )
      }

      // Regiments can't equip items/upgrades
      continue
    }

    for (const attachStr of attachments) {
      const [attachId, countStr] = attachStr.split('x')
      const attachCount = countStr ? parseInt(countStr, 10) : 1

      const isUpgrade = attachId.startsWith('UPG')
      const isItem = attachId.startsWith('MI')
      const isStand = attachId.startsWith('S')

      if (isUpgrade) {
        const [upgradeKey, upgradeData] = schemaUpgrades.find(([, u]) => u.id === attachId) || []
        const canAdd = schemaData.upgrades?.find(name => upgradeKey === name)
        if (!upgradeKey || !upgradeData || !canAdd) continue

        for (let i = 0; i < attachCount; i++) UnitMutator.equipUpgrade(state, schemaKey, upgradeKey, upgradeData)
        continue
      }

      if (isItem) {
        const [itemKey, itemData] = schemaItems.find(([, i]) => i.id === attachId) || []
        if (!itemKey || !itemData) continue

        for (let i = 0; i < attachCount; i++) UnitMutator.equipItem(state, schemaKey, itemKey, itemData)
        continue
      }

      if (isStand) {
        const [standKey, standData] = schemaStands.find(([, s]) => s.id === attachId) || []
        const canAdd = schemaData.extraStands?.find(name => standKey === name)
        if (!standKey || !standData || !canAdd) continue

        for (let i = 0; i < attachCount; i++) UnitMutator.addStand(state, schemaKey, standKey, standData)
      }
    }
  }
}