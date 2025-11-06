import { writable, get } from 'svelte/store'
import * as Operations from './operations'


const createBuilderStore = (): IBuilderStore => {
  const state = writable<IBuilderState>({
    armyName: '',
    armyCost: 0,
    armyCostLimit: 2000,
    units: {},
    armyErrors: [],
    regimentCountAs: {
      units: {},
      upgrades: {}
    },
    lookup: { 
      magicItems: {},
      armyUpgrades: {},
      armyStands: {}
    }
  })

  return {
    subscribe: state.subscribe,
    getState: () => get(state),

    ...Operations.setArmyActions(state),
    ...Operations.setUnitActions(state),

    ...Operations.getAugmentsActions(state)
  } as IBuilderStore
}

const builderStore = createBuilderStore()
export default builderStore