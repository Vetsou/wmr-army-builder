declare global {
  interface ITestCase<T> {
    name: string
    setup(store: IBuilderState): void
    expected: T
  }
}

export {}