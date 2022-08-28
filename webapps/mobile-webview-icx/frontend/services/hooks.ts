import { Wallet } from "@astrox/sdk-core"
import { AstroXWebViewHandler } from "@astrox/sdk-webview"
import { useEffect, useState } from "react"

export const useICX = (): UseICXResult => {
  const [icx, setIcx] = useState<AstroXWebViewHandler>(
    ((window as any).icx as AstroXWebViewHandler) || new AstroXWebViewHandler(),
  )
  useEffect(() => {
    if ((window as any).icx === undefined) {
      setIcx(new AstroXWebViewHandler())
    }
  }, [(window as any).icx as AstroXWebViewHandler])

  const ready = icx.isReady()
  const connected = icx.getPrincipal()?.isAnonymous()

  return { ready, connected, icx }
}

export const useWallet = () => {
  const { connected, icx } = useICX()
  const [wallet, setWallet] = useState<Wallet | undefined>(undefined)
  useEffect(() => {
    if (connected) {
      setWallet(icx.wallet)
    }
  }, [connected])

  return [wallet]
}

type BalanceResponse = {
  amount: number
  canisterId: string
  decimals: number
  image?: string
  name: string
  symbol: string
}[]

export const useBalance = () => {
  const { connected, icx } = useICX()
  const [balance, setBalance] = useState<BalanceResponse | undefined>(undefined)
  useEffect(() => {
    if (connected) {
      ;(async () => {
        setBalance(await icx.queryBalance())
      })()
    }
  }, [connected])

  return [balance]
}

export type Props = {
  amount: number
  to: string
  from?: string
}

export enum TransferError {
  InsufficientBalance,
  TransferFailed,
  FaultyAddress,
  NotConnected,
}

export const useTransfer = ({ amount, to, from = undefined }: Props) => {
  // TODO: check if supported or not
  const [wallet] = useWallet()
  const { icx } = useICX()
  const [loading, setLoading] = useState<boolean>(false)
  const [payload, setPayload] = useState<{ height: number }>()
  const [error, setError] = useState<{ kind: TransferError }>()

  const transfer = async () => {
    if (!wallet || !icx) {
      return new Error(JSON.stringify({ kind: TransferError.NotConnected }))
    }
    setLoading(true)
    const result = await icx.requestTransfer({
      amount,
      to,
    })
    result.match(
      (payload) => {
        // TODO: ?
        setPayload(payload)
      },
      (error) => {
        setError(error)
      },
    )
    setLoading(false)
    return result
  }

  return [transfer, { loading, error }] as const
}

export interface UseICXResult {
  ready: boolean
  connected: boolean
  icx: AstroXWebViewHandler
}
