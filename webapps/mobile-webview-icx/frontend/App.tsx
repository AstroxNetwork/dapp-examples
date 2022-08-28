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
import { useICX } from "./services/hooks"

function App() {
  const { connected, ready, icx } = useICX()

  useEffect(() => {
    if (!ready) {
      console.error("Webview bridge is not ready")
    }
  }, [ready])

  const connectICX = async () => {
    await icx.connect({
      delegationTargets: [counter.canisterId],
      host: window.origin,
    })
  }

  return (
    <div className="App">
      <div className="auth-section">
        <Button onClick={connectICX}>Connect</Button>
      </div>

      <p className="examples-title">Examples</p>
      <div className="examples">
        <Counter />
        <Profile />
        <Transfer />
      </div>
    </div>
  )
}

export default () => <App />
