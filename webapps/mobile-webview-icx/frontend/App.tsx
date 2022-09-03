import React, { useEffect, useState } from "react"
import logo from "./assets/dfinity.svg"

/*
 * Import canister definitions like this:
 */
import * as counter from "../.dfx/local/canisters/counter"
import { Button } from "antd-mobile"

import { Counter } from "./components/Counter"
import { Profile } from "./components/Profile"
import { Transfer } from "./components/Transfer"
import { AstroXWebViewHandler } from "@astrox/sdk-webview"
import { useConnect } from "./services/hooks"

function App() {
  const { ready, icx } = useConnect()
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    if (!ready) {
      console.error("Webview bridge is not ready")
    } else {
      if (icx.getPrincipal() !== undefined) {
        console.log(icx.getPrincipal().toText())
      }
    }
  }, [ready, icx])

  const connectICX = async () => {
    await icx.connect({
      delegationTargets: [counter.canisterId],
      host: window.origin,
    })
    if (icx.getPrincipal().isAnonymous()) {
      setConnected(false)
    } else {
      setConnected(true)
    }
  }

  const clean = async () => {
    localStorage.clear()
  }

  return (
    <div className="App">
      <div className="auth-section">
        <Button onClick={connectICX}>
          {connected ? icx.getPrincipal().toText().substring(0, 4) : "Connect"}
        </Button>
        <Button onClick={clean}>Clean</Button>
      </div>

      <p className="examples-title">Examples</p>
      <div className="examples">
        <Counter connected={connected} />
        <Profile connected={connected} />
        <Transfer connected={connected} />
      </div>
    </div>
  )
}

export default () => <App />
