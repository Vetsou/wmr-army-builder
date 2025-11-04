import { writable, get } from 'svelte/store'
import { UnitActions, ArmyActions } from './operations'


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

    ...ArmyActions(state),
    ...UnitActions(state),
  }
}

const BuilderStore = createBuilderStore()
export default BuilderStore