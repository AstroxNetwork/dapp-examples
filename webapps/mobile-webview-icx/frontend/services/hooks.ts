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

interface UseICXResult {
  ready: boolean
  connected: boolean
  icx: AstroXWebViewHandler
}
