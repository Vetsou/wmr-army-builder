import * as DataGenerator from '$test/dataGenerator'

import * as ArmyMutator from '$builder/mutator/army'
import * as UnitMutator from '$builder/mutator/unit'


export const encodeUnitTestCases = (): ITestCase<string>[] => {
  return [
    {
      name: 'simple unit',
      setup: (store: IBuilderState): void => {
        const schemaUnit = DataGenerator.createArmyUnit({ id: 'U1' })
        ArmyMutator.addUnit(store, 'UnitA', schemaUnit, 2)
      },
      expected: 'U1=2'
    },
    {
      name: 'multiple units',
      setup: (store: IBuilderState): void => {
        const schemaUnit1 = DataGenerator.createArmyUnit({ id: 'U3' })
        ArmyMutator.addUnit(store, 'UnitA', schemaUnit1, 1)

        const schemaUnit2 = DataGenerator.createArmyUnit({ id: 'U13' })
        ArmyMutator.addUnit(store, 'UnitB', schemaUnit2, 23)

        const schemaUnit3 = DataGenerator.createArmyUnit({ id: 'U34' })
        ArmyMutator.addUnit(store, 'UnitC', schemaUnit3, 6)
      },
      expected: 'U3=1&U13=23&U34=6'
    },
    {
      name: 'unit with single item',
      setup: (store: IBuilderState): void => {
        const schemaUnit = DataGenerator.createArmyUnit({ id: 'U9' })
        ArmyMutator.addUnit(store, 'UnitA', schemaUnit, 3)

        const schemaItem = DataGenerator.createSchemaItem({ id: 'MI7' })
        UnitMutator.equipItem(store, 'UnitA', 'ItemA', schemaItem)
      },
      expected: 'U9=3[MI7]'
    },
    {
      name: 'unit with duplicate item',
      setup: (store: IBuilderState): void => {
        const schemaUnit = DataGenerator.createArmyUnit({ id: 'U14' })
        ArmyMutator.addUnit(store, 'UnitA', schemaUnit, 3)

        const schemaItem = DataGenerator.createSchemaItem({ id: 'MI14' })
        UnitMutator.equipItem(store, 'UnitA', 'ItemA', schemaItem)
        UnitMutator.equipItem(store, 'UnitA', 'ItemA', schemaItem)
        UnitMutator.equipItem(store, 'UnitA', 'ItemA', schemaItem)
      },
      expected: 'U14=3[MI14x3]'
    },
    {
      name: 'unit with multiple different items',
      setup: (store: IBuilderState): void => {
        const schemaUnit = DataGenerator.createArmyUnit({ id: 'U43' })
        ArmyMutator.addUnit(store, 'UnitA', schemaUnit, 11)

        const schemaItem1 = DataGenerator.createSchemaItem({ id: 'MI7' })
        UnitMutator.equipItem(store, 'UnitA', 'ItemA', schemaItem1)
        const schemaItem2 = DataGenerator.createSchemaItem({ id: 'MI9' })
        UnitMutator.equipItem(store, 'UnitA', 'ItemB', schemaItem2)
        UnitMutator.equipItem(store, 'UnitA', 'ItemB', schemaItem2)
        const schemaItem3 = DataGenerator.createSchemaItem({ id: 'MI16' })
        UnitMutator.equipItem(store, 'UnitA', 'ItemC', schemaItem3)
      },
      expected: 'U43=11[MI7,MI9x2,MI16]'
    },
    {
      name: 'unit with single upgrade',
      setup: (store: IBuilderState): void => {
        const schemaUnit = DataGenerator.createArmyUnit({ id: 'U67' })
        ArmyMutator.addUnit(store, 'UnitA', schemaUnit, 2)

        const schemaUpgrade = DataGenerator.createSchemaUpgrade({ id: 'UPG23' })
        UnitMutator.equipUpgrade(store, 'UnitA', 'UpgradeA', schemaUpgrade)
      },
      expected: 'U67=2[UPG23]'
    },
    {
      name: 'unit with duplicate upgrade',
      setup: (store: IBuilderState): void => {
        const schemaUnit = DataGenerator.createArmyUnit({ id: 'U12' })
        ArmyMutator.addUnit(store, 'UnitA', schemaUnit, 1)

        const schemaUpgrade = DataGenerator.createSchemaUpgrade({ id: 'UPG17' })
        UnitMutator.equipUpgrade(store, 'UnitA', 'UpgradeA', schemaUpgrade)
        UnitMutator.equipUpgrade(store, 'UnitA', 'UpgradeA', schemaUpgrade)
      },
      expected: 'U12=1[UPG17x2]'
    },
    {
      name: 'unit with multiple different items',
      setup: (store: IBuilderState): void => {
        const schemaUnit = DataGenerator.createArmyUnit({ id: 'U76' })
        ArmyMutator.addUnit(store, 'UnitA', schemaUnit, 6)

        const schemaUpgrade1 = DataGenerator.createSchemaUpgrade({ id: 'UPG17' })
        UnitMutator.equipUpgrade(store, 'UnitA', 'UpgradeA', schemaUpgrade1)
        const schemaUpgrade2 = DataGenerator.createSchemaUpgrade({ id: 'UPG23' })
        UnitMutator.equipUpgrade(store, 'UnitA', 'UpgradeB', schemaUpgrade2)
        UnitMutator.equipUpgrade(store, 'UnitA', 'UpgradeB', schemaUpgrade2)
        const schemaUpgrade3 = DataGenerator.createSchemaUpgrade({ id: 'UPG41' })
        UnitMutator.equipUpgrade(store, 'UnitA', 'UpgradeC', schemaUpgrade3)
      },
      expected: 'U76=6[UPG17,UPG23x2,UPG41]'
    },
    {
      name: 'multiple units with multiple augments',
      setup: (store: IBuilderState): void => {
        const schemaUnit = DataGenerator.createArmyUnit({ id: 'U132' })
        ArmyMutator.addUnit(store, 'UnitA', schemaUnit, 7)

        const schemaUpgrade = DataGenerator.createSchemaUpgrade({ id: 'UPG44' })
        UnitMutator.equipUpgrade(store, 'UnitA', 'UpgradeA', schemaUpgrade)
        UnitMutator.equipUpgrade(store, 'UnitA', 'UpgradeA', schemaUpgrade)
        const schemaUpgrade2 = DataGenerator.createSchemaUpgrade({ id: 'UPG21' })
        UnitMutator.equipUpgrade(store, 'UnitA', 'UpgradeB', schemaUpgrade2)
        UnitMutator.equipUpgrade(store, 'UnitA', 'UpgradeB', schemaUpgrade2)

        const schemaItem = DataGenerator.createSchemaItem({ id: 'MI75' })
        UnitMutator.equipItem(store, 'UnitA', 'ItemA', schemaItem)
        const schemaItem2 = DataGenerator.createSchemaItem({ id: 'MI92' })
        UnitMutator.equipItem(store, 'UnitA', 'ItemB', schemaItem2)
        UnitMutator.equipItem(store, 'UnitA', 'ItemB', schemaItem2)


        const schemaUnit2 = DataGenerator.createArmyUnit({ id: 'U7' })

        ArmyMutator.addUnit(store, 'UnitB', schemaUnit2, 11)
        const schemaUpgrade3 = DataGenerator.createSchemaUpgrade({ id: 'UPG77' })
        UnitMutator.equipUpgrade(store, 'UnitB', 'UpgradeC', schemaUpgrade3)

        const schemaUpgrade4 = DataGenerator.createSchemaUpgrade({ id: 'UPG9' })
        UnitMutator.equipUpgrade(store, 'UnitB', 'UpgradeD', schemaUpgrade4)
        UnitMutator.equipUpgrade(store, 'UnitB', 'UpgradeD', schemaUpgrade4)
      },
      expected: 'U132=7[UPG44x2,UPG21x2,MI75,MI92x2]&U7=11[UPG77,UPG9x2]'
    }
  ]
}

export const encodeRegimentTestCases = (): ITestCase<string>[] => {
  return []
}