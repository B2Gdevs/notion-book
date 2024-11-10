type Constructor<T = {}> = new (...args: any[]) => T;

export function Mixin<Base extends Constructor, Mixins extends Constructor[]>(
  baseClass: Base,
  ...mixins: Mixins
): Base &
  UnionToIntersection<InstanceType<Mixins[number]>> &
  UnionToIntersection<Mixins[number]> {
  class Mixed extends baseClass {
    constructor(...args: any[]) {
      super(...args);
    }
  }

  for (const mixin of mixins) {
    // Copy instance methods
    for (const prop of Object.getOwnPropertyNames(mixin.prototype)) {
      Object.defineProperty(
        Mixed.prototype,
        prop,
        Object.getOwnPropertyDescriptor(mixin.prototype, prop)!,
      );
    }
    // Copy static methods
    for (const prop of Object.getOwnPropertyNames(mixin)) {
      if (prop !== 'prototype' && prop !== 'name' && prop !== 'constructor') {
        Object.defineProperty(
          Mixed,
          prop,
          Object.getOwnPropertyDescriptor(mixin, prop)!,
        );
      }
    }
  }

  return Mixed as any;
}

// Helper type to convert Union type to Intersection type
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
  k: infer I,
) => void
  ? I
  : never;
