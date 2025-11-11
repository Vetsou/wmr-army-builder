import { get, type Writable } from 'svelte/store'


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
