import * as Operations from './operations'
import * as ArmyMutator from './mutator/army'


export const createBuilderContext = (
  armySchema: IArmySchema,
  items: Record<string, ISchemaMagicItem>,
  regiments: Record<string, ISchemaRegiment>,
  urlParams: Record<string, string> | undefined
): IBuilderStore => {
  let state: IBuilderState

  if (urlParams && Object.keys(urlParams).length > 0) {
    state = ArmyMutator.createStateFromUrl(armySchema, items, regiments, urlParams)
  } else {
    state = ArmyMutator.createDefaultState(armySchema, items, regiments)
  }

  return {
    ...state,
    ...Operations.setArmyActions(state),
    ...Operations.setUnitActions(state),

    ...Operations.getAugmentsActions(state)
  } satisfies IBuilderStore
}