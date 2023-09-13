/// <reference path="module.d.ts"/>
import integration from './src/integration'

export type Integration = typeof integration
export default integration
export { defineConfig, type FullAuthConfig as Config } from './src/config'
