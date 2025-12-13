import { get, type Writable } from 'svelte/store'
import { isRegiment } from '../types/guards'


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
    console.log(caStr)
    params.set(unit.id, `${unit.count}${caStr}${attachmentsStr}`)
  }

  return params.toString()
}