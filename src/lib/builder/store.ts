import * as Operations from './operations'
import * as ArmyMutator from './mutator/army'


export const createBuilderContext = (
  armySchema: IArmySchema,
  items: Record<string, ISchemaMagicItem>,
  regiments: Record<string, ISchemaRegiment>
): IBuilderStore => {
  const state = ArmyMutator.createState(armySchema, items, regiments)

  return {
    ...state,
    ...Operations.setArmyActions(state),
    ...Operations.setUnitActions(state),

    ...Operations.getAugmentsActions(state)
  } satisfies IBuilderStore
}