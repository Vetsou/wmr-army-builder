import { get, type Writable } from 'svelte/store'
import * as ArmyMutator from '$builder/mutator/army'
import * as UnitMutator from '$builder/mutator/unit'


export function encodeArmyToUrl(
  writableState: Writable<IBuilderState>
): string {
  const state = get(writableState)

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

    const attachStr = attachments.length > 0 ? `[${attachments.join(',')}]` : ''
    params.set(unit.id, `${unit.count}${attachStr}`)
  }

  return params.toString()
}

export function decodeArmyFromUrl(
  builderState: Writable<IBuilderState>,
  encoded: string,
  armySchema: IArmySchema,
  magicItems: Record<string, ISchemaMagicItem>,
  schemaRegiments: Record<string, ISchemaRegiment>
): void {
  const params = new URLSearchParams(encoded)

  const armyUnits = Object.entries(armySchema.units)
  const armyUpgrades = Object.entries(armySchema.upgrades ?? {})
  const armyStands = Object.entries(armySchema.stands ?? {})

  const items = Object.entries(magicItems)
  const regiments = Object.entries(schemaRegiments)

  for (const [unitId, value] of params.entries()) {
    const match = value.match(/^(\d+)(?:\[(.*)\])?$/)
    if (!match) continue

    const unitCount = parseInt(match[1], 10)
    const attachments = match[2] ? match[2].split(',') : []

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
      ArmyMutator.addRegiment(builderState, schemaKey, schemaData, {}, unitCount) // TODO HANDLE COUNT_AS RULE
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
        continue
      }
    }
  }
}