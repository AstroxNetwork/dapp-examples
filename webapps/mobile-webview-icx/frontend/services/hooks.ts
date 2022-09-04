import { TransferToken, Wallet } from "@astrox/sdk-core"
import { AstroXWebViewHandler } from "@astrox/sdk-webview"
import {
  TokenTransferResponse,
  TransactionMessageKind,
  TransactionResponseSuccess,
} from "@astrox/sdk-webview/build/types"
import { useEffect, useState } from "react"

export const useConnect = (): UseConnectResult => {
  const [icx, setIcx] = useState<AstroXWebViewHandler | undefined>(
    (window as any).icx as AstroXWebViewHandler | undefined,
  )
  const [ready, setReady] = useState<boolean>(false)
  const [connected, setConnected] = useState<boolean>(false)
  useEffect(() => {
    if (((window as any).icx as AstroXWebViewHandler) === undefined || !ready) {
      ;(async () => {
        const thisIcx = (window as any).icx as AstroXWebViewHandler
        await thisIcx.init()
        setIcx(thisIcx)
        setReady(thisIcx.isReady())
        setConnected(thisIcx.getPrincipal()?.isAnonymous())
      })()
    } else {
      setReady(((window as any).icx as AstroXWebViewHandler).isReady())
      setConnected(
        ((window as any).icx as AstroXWebViewHandler)
          .getPrincipal()
          ?.isAnonymous(),
      )
    }
  }, [ready])
  return { ready, connected, icx }
}

export const useWallet = ({ connected }: { connected: boolean }) => {
  const { icx } = useConnect()
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

export const useBalance = ({ connected }: { connected: boolean }) => {
  const { icx } = useConnect()
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
  amount: bigint
  to: string
  from?: string
}

export enum TransferError {
  InsufficientBalance,
  TransferFailed,
  FaultyAddress,
  NotConnected,
}

export const useTransfer = ({
  connected,
  amount,
  to,
  from = undefined,
}: Props & { connected: boolean }) => {
  // TODO: check if supported or not
  const [wallet] = useWallet({ connected })
  const { icx } = useConnect()
  const [loading, setLoading] = useState<boolean>(false)
  const [payload, setPayload] = useState<{ height: number }>()
  const [error, setError] = useState<{ kind: TransferError }>()

  const transfer = async () => {
    if (!wallet || !icx) {
      return new Error(JSON.stringify({ kind: TransferError.NotConnected }))
    }
    setLoading(true)
    const result = await icx.requestTransfer({
      symbol: "ICP",
      standard: "ICP",
      amount,
      to,
    })
    // result.match(
    //   (payload) => {
    //     // TODO: ?
    //     setPayload(payload)
    //   },
    //   (error) => {
    //     setError(error)
    //   },
    // )

    let ret = { height: 0 }
    if (result.kind === TransactionMessageKind.success) {
      const { blockHeight } = (result as TransactionResponseSuccess)
        .payload as TokenTransferResponse
      ret = { height: Number.parseInt(blockHeight.toString()) }
      setPayload(ret)
    } else {
      setError({ kind: TransferError.TransferFailed })
    }
    setLoading(false)
    return ret
  }

  return [transfer, { loading, error }] as const
}

export interface UseConnectResult {
  ready: boolean
  connected: boolean
  icx: AstroXWebViewHandler
}
