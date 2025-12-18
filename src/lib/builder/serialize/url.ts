import { get, type Writable } from 'svelte/store'
import { getCountAsRuleForAdd } from '$lib/components/logic'
import { isRegiment } from '../types/guards'

import * as ArmyMutator from '$builder/mutator/army'
import * as UnitMutator from '$builder/mutator/unit'


type ParsedCaGroupEntry = {
  key: string
  count: number
}

const parseGroup = <T extends { id: string }>(
  group: string | undefined,
  schema: [string, T][]
): ParsedCaGroupEntry[] => {
  if (!group) return []

  return group.split(',').map(attachId => {
    const [id, countStr] = attachId.split('x')
    const count = countStr ? parseInt(countStr, 10) : 1

    const match = schema.find(([_, s]) => s.id === id)
    if (!match) throw new Error(`Invalid countAs id: ${id}`)

    return { key: match[0], count }
  })
}

const hasValidCountAsRule = (
  unitCount: number,
  units: ParsedCaGroupEntry[],
  upgrades: ParsedCaGroupEntry[],
  allowedEntries: CountAsRuleResult
): boolean => {
  const requiresUnit = allowedEntries.units.length > 0
  const requiresUpgrade = allowedEntries.upgrades.length > 0

  // Check if regiment has the required CA data
  if (requiresUnit && units.length === 0) return false
  if (requiresUpgrade && upgrades.length === 0) return false

  // Regiment count should be equal to CA units count
  const caUnitCount = units.reduce((acc, u) => acc + u.count, 0)
  if (units.length > 0 && caUnitCount !== unitCount) return false

  // If there are upgrades they should be equal to CA
  const upgradeTotal = upgrades.reduce((acc, upg) => acc + upg.count, 0)
  if (upgrades.length > 0 && upgradeTotal !== unitCount) return false

  return true
}

const isAllowedCountAsEntry = <T>(
  entries: ParsedCaGroupEntry[],
  allowed: [string, T][]
): boolean => {
  const allowedKeys = new Set(allowed.map(([key]) => key))
  return entries.every(e => allowedKeys.has(e.key))
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
      const allowed = getCountAsRuleForAdd(state, schemaKey)
      const requiresUnit = allowed.units.length > 0
      const requiresUpgrade = allowed.upgrades.length > 0

      // If regiment doesn't have CA rules then just add them
      if (!requiresUnit && !requiresUpgrade) {
        ArmyMutator.addRegiment(state, schemaKey, schemaData, {}, unitCount)
        continue
      }

      const units = parseGroup(caUnitIds, schemaUnits)
      const upgrades = parseGroup(caUpgradeIds, schemaUpgrades)

      if (!hasValidCountAsRule(unitCount, units, upgrades, allowed)) {
        continue
      }

      if (!isAllowedCountAsEntry(units, allowed.units) || !isAllowedCountAsEntry(upgrades, allowed.upgrades)) {
        continue
      }

      let unitIdx = 0
      let upgradeIdx = 0
      let unitsLeft = units[0]?.count ?? 0
      let upgradesLeft = upgrades[0]?.count ?? 0

      for (let i = 0; i < unitCount; i++) {
        let unitName: string | undefined
        let upgradeName: string | undefined

        if (units.length) {
          unitName = units[unitIdx].key
          if (--unitsLeft === 0) {
            unitIdx++
            unitsLeft = units[unitIdx]?.count ?? 0
          }
        }

        if (upgrades.length) {
          upgradeName = upgrades[upgradeIdx].key
          if (--upgradesLeft === 0) {
            upgradeIdx++
            upgradesLeft = upgrades[upgradeIdx]?.count ?? 0
          }
        }

        ArmyMutator.addRegiment(state, schemaKey, schemaData, { unitName, upgradeName }, 1)
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