import { get, type Writable } from 'svelte/store'
import { getRegimentCountAsRuleUnits } from '$lib/components/logic'

import * as ArmyMutator from '$builder/mutator/army'
import * as UnitMutator from '$builder/mutator/unit'


export function encodeArmyToUrl(
  builderState: Writable<IBuilderState>
): string {
  const state = get(builderState)

  const params = new URLSearchParams()
  const units = Object.entries(state.units)

  for (const [_, unit] of units) {
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

    const isRegiment = unit.id.startsWith('R')
    let caStr = ''

    if (isRegiment) {
      const regiment = unit as IArmyRegiment

      const caUnitName = regiment.countAsUnit
      const caUpgradeName = regiment.countAsUpgrade

      const caUnitId = caUnitName && state.lookup.armyUnits[caUnitName]
        ? state.lookup.armyUnits[caUnitName].id
        : ''

      const caUpgradeId = caUpgradeName && state.lookup.armyUpgrades && state.lookup.armyUpgrades[caUpgradeName]
        ? state.lookup.armyUpgrades[caUpgradeName].id
        : ''

      if (caUnitId || caUpgradeId) caStr = `(CA=${caUnitId}/${caUpgradeId})`
    }

    const attachStr = attachments.length > 0 ? `[${attachments.join(',')}]` : ''
    params.set(unit.id, `${unit.count}${caStr}${attachStr}`)
  }

  return params.toString()
}

export function decodeArmyFromUrl(
  builderState: Writable<IBuilderState>,
  encoded: string,
  schemaRegiments: Record<string, ISchemaRegiment>
): void {
  const params = new URLSearchParams(encoded)

  const state = get(builderState)
  const armyUnits = Object.entries(state.lookup.armyUnits)
  const armyUpgrades = Object.entries(state.lookup.armyUpgrades ?? {})
  const armyStands = Object.entries(state.lookup.armyStands ?? {})

  const items = Object.entries(state.lookup.magicItems)
  const regiments = Object.entries(schemaRegiments)

  for (const [unitId, value] of params.entries()) {
    /**
     * Match strings like:
     *   "3"
     *   "3[UPG1,MI2x2]"
     *   "3(CA=U1/UPG3)"
     *   "3(CA=U1/UPG3)[UPG1,MI2x2]"
     */
    const match = value.match(/^(\d+)(?:\(CA=([^\/\)]*)?(?:\/([^)\]]*))?\))?(?:\[(.*)\])?$/)
    if (!match) continue

    // Regex groups assign
    const unitCount = parseInt(match[1], 10)
    const caUnitId = match[2] || null
    const caUpgradeId = match[3] || null
    const attachments = match[4] ? match[4].split(',') : []

    const isRegiment = unitId.startsWith('R')
    const isUnit = unitId.startsWith('U')
    if (!isRegiment && !isUnit) continue

    const schemaEntry = isRegiment 
      ? regiments.find(([_, r]) => r.id === unitId)
      : armyUnits.find(([_, u]) => u.id === unitId)

    if (!schemaEntry) continue
    const [schemaKey, schemaData] = schemaEntry

    if (isUnit) {
      ArmyMutator.addUnit(builderState, schemaKey, schemaData, unitCount)
    } else {
      // We already know that unit is one of SchemaUnit or SchemaRegiment
      const state = get(builderState)
      const allowed = getRegimentCountAsRuleUnits(state, schemaData)

      const requiresUnit = allowed.units.length > 0
      const requiresUpgrade = allowed.upgrades.length > 0
      const unrestricted = !requiresUnit && !requiresUpgrade

      let countAsUnitName
      let countAsUpgradeName

      if (!unrestricted) {
        const caUnit = requiresUnit ? allowed.units.find(([_, data]) => data.id === caUnitId) : []
        const caUpgrade = requiresUpgrade ? allowed.upgrades.find(([_, data]) => data.id === caUpgradeId) : []

        // Regiment has countAs rule defined but missing countAs URL data
        if (!caUnit || !caUpgrade) continue

        countAsUnitName = caUnit[0]
        countAsUpgradeName = caUpgrade[0]
      }

      ArmyMutator.addRegiment(
        builderState,
        schemaKey,
        schemaData, {
          unitName: countAsUnitName,
          upgradeName: countAsUpgradeName
        },
        unitCount)
    }

    for (const rawAttach of attachments) {
      const [attachId, countStr] = rawAttach.split('x')
      const attachCount = countStr ? parseInt(countStr, 10) : 1

      const isUpgrade = attachId.startsWith('UPG')
      const isItem = attachId.startsWith('MI')
      const isStand = attachId.startsWith('S')

      if (isUpgrade) {
        const [upgradeKey, upgradeData] = armyUpgrades.find(([, u]) => u.id === attachId) || []
        const canAdd = schemaData.upgrades?.find(name => upgradeKey === name)
        if (!upgradeKey || !upgradeData || !canAdd) continue

        for (let i = 0; i < attachCount; i++) UnitMutator.equipUpgrade(builderState, schemaKey, upgradeKey, upgradeData)
        continue
      }

      if (isItem) {
        const [itemKey, itemData] = items.find(([, i]) => i.id === attachId) || []
        if (!itemKey || !itemData) continue

        for (let i = 0; i < attachCount; i++) UnitMutator.equipItem(builderState, schemaKey, itemKey, itemData)
        continue
      }

      if (isStand) {
        const [standKey, standData] = armyStands.find(([, s]) => s.id === attachId) || []
        const canAdd = schemaData.extraStands?.find(name => standKey === name)
        if (!standKey || !standData || !canAdd) continue

        for (let i = 0; i < attachCount; i++) UnitMutator.addStand(builderState, schemaKey, standKey, standData)
      }
    }
  }
}