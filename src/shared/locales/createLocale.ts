import { en } from './en';

export type LocaleMessages = typeof en;

export type DeepPartial<T> = {
  [Key in keyof T]?: T[Key] extends Record<string, unknown>
    ? DeepPartial<T[Key]>
    : T[Key];
};

function mergeLocale<T extends Record<string, unknown>>(base: T, overrides: DeepPartial<T>): T {
  const result = { ...base } as T;

  for (const key of Object.keys(overrides) as Array<keyof T>) {
    const override = overrides[key];
    const baseValue = base[key];

    if (
      override &&
      typeof override === 'object' &&
      !Array.isArray(override) &&
      baseValue &&
      typeof baseValue === 'object' &&
      !Array.isArray(baseValue)
    ) {
      result[key] = mergeLocale(
        baseValue as Record<string, unknown>,
        override as DeepPartial<Record<string, unknown>>,
      ) as T[keyof T];
    } else if (override !== undefined) {
      result[key] = override as T[keyof T];
    }
  }

  return result;
}

export function createLocale(overrides: DeepPartial<LocaleMessages>): LocaleMessages {
  return mergeLocale(en, overrides);
}
