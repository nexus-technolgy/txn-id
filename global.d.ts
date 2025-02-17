/* eslint-disable @typescript-eslint/no-explicit-any */
declare module "bun:test" {
  type TestFn = (name: string, fn: () => void) => void;

  interface ItFunction extends TestFn {
    each<T extends any[]>(
      table: ReadonlyArray<T>
    ): (name: string, fn: (...args: T) => void) => void;

    only: TestFn;
    skip: TestFn;
    todo: (name: string) => void;
  }

  export const it: ItFunction;

  export const describe: TestFn & {
    only: TestFn;
    skip: TestFn;
  };

  export function beforeEach(fn: () => void): void;
  export function afterEach(fn: () => void): void;
  export function beforeAll(fn: () => void): void;
  export function afterAll(fn: () => void): void;
  export function expect(value: any): any;

  export interface Mock<TArgs extends any[] = any[], TReturn = any> {
    (...args: TArgs): TReturn;
    mock: {
      calls: TArgs[];
      results: TReturn[];
      instances: any[];
      clear(): void;
      reset(): void;
      restore(): void;
    };
    mockImplementation(fn: (...args: TArgs) => TReturn): this;
    mockReturnValue(value: TReturn): this;
    mockReturnValueOnce(value: TReturn): this;
    mockResolvedValue(value: Awaited<TReturn>): this;
    mockResolvedValueOnce(value: Awaited<TReturn>): this;
    mockRejectedValue(value: any): this;
    mockRejectedValueOnce(value: any): this;
  }

  export function mock<TArgs extends any[] = any[], TReturn = any>(
    fn?: (...args: TArgs) => TReturn
  ): Mock<TArgs, TReturn>;

  export function spyOn<T extends object, K extends keyof T>(
    obj: T,
    method: K
  ): Mock<Parameters<T[K]>, ReturnType<T[K]>>;
}

declare global {
  const describe: typeof import("bun:test").describe;
  const it: typeof import("bun:test").it;
  const test: typeof import("bun:test").test;
  const beforeEach: typeof import("bun:test").beforeEach;
  const afterEach: typeof import("bun:test").afterEach;
  const beforeAll: typeof import("bun:test").beforeAll;
  const afterAll: typeof import("bun:test").afterAll;
  const expect: typeof import("bun:test").expect;
  const mock: typeof import("bun:test").mock;
  const spyOn: typeof import("bun:test").spyOn;
}

export {};
