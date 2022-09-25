export type DefinitionLinked = number // Will appear in definitions
type DefinitionInlined = string // Not exported types will be inlined

/**
 * @asType integer
 */
type integer = number

export type RichType = {
  num: number
  int: integer
  str: string
  bool: boolean
  arr: any[]
  obj: object

  optional?: number
  // recursion: RichType // NOTE: Compiler doesn't support recursive schema now
  defInlined: DefinitionInlined
  defLinked: DefinitionLinked

  fixedArr: [number, string, boolean]
  nestedArr: number[][]

  fixedObj: {
    fst: number
    snd: string
    trd: boolean
  }
}