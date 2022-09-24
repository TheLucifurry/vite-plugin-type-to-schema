import { resolve } from 'path'
import { IConfig, IConfigResolved } from './types'

export function resolveConfig(config: IConfig = {}, root: string): IConfigResolved {
  const dts = config.dts === false
    ? false
    : resolve(
      root,
      typeof config.dts === 'string'
        ? config.dts
        : 'schemas.d.ts',
    ) as string

  return {
    suffix: config?.suffix || '?schema',
    options: config?.options || {},
    dts,
  }
}