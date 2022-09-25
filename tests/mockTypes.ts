export interface IMockVitePlugin {
  load(id: string): string
  buildEnd(error?: Error): void
}