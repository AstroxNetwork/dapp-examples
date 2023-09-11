export type TokenSymbol = 'ICP' | 'WICP(DIP20)' | 'WICP(EXT)' | 'XTC' | 'OGY' | 'GHOST'

export enum TokenSymbolEnum {
  ICP = 'ICP',
  WICPDIP20 = 'WICP(DIP20)',
  WICPEXT = 'WICP(EXT)',
  XTC = 'XTC',
  OGY = 'OGY',
  GHOST = 'GHOST',
}


export const tokenOptions: {label: string, value: TokenSymbol}[] = [
  {
    label: 'ICP',
    value: TokenSymbolEnum.ICP
  },
  {
    label: 'XTC',
    value: TokenSymbolEnum.XTC
  },
  {
    label: 'OGY',
    value: TokenSymbolEnum.OGY
  },
  {
    label: 'GHOST',
    value: TokenSymbolEnum.GHOST
  }
]


export const NFTOptions: {label: string, value: 'EXT' | 'DIP20'}[] = [
  {
    label: 'EXT',
    value: 'EXT'
  },
  {
    label: 'DIP20',
    value: 'DIP20'
  },
]

