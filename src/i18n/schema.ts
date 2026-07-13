/**
 * Maps an English resource slice to its translation-schema shape: every leaf
 * string becomes a plain `string`, so a translation (e.g. `de`) is forced to
 * structurally match the English source-of-truth without freezing its values.
 */
export type DeepStringSchema<T> = {
  [K in keyof T]: T[K] extends string ? string : DeepStringSchema<T[K]>;
};
