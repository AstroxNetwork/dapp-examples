import { ActorSubclass } from "@dfinity/agent"
import { useConnect } from "../services/hooks"
import React, { useEffect, useState } from "react"
import { canisterId, idlFactory } from "../../.dfx/local/canisters/counter"
import { _SERVICE as CounterService } from "../../.dfx/local/canisters/counter/counter.did"

const Counter = ({ connected }: { connected: boolean }) => {
  /*
   * This how you use canisters throughout your app.
   */
  const { icx } = useConnect()
  const [count, setCount] = useState<bigint>()

  const [counter, setCounter] = useState<
    ActorSubclass<CounterService> | undefined
  >(undefined)

  const initCounter = async () => {
    console.log("initCounter")
    console.log(icx)
    setCounter(await icx.createActor<CounterService>(canisterId, idlFactory))
  }

  const refreshCounter = async () => {
    const freshCount = (await counter.getValue()) as bigint
    setCount(freshCount)
  }

  const increment = async () => {
    console.log({ connected })
    if (counter) {
      await counter.increment()
      await refreshCounter()
    }
  }

  useEffect(() => {
    if (connected) {
      console.log("counter")
      if (!counter) {
        console.log("counter is not found")
        ;(async () => await initCounter())()
      } else {
        refreshCounter()
      }
    }
    console.log("useEffect")
  }, [connected, counter])

  return (
    <div className="example">
      <p style={{ fontSize: "2.5em" }}>{count?.toString()}</p>
      <button className="connect-button" onClick={increment}>
        +
      </button>
    </div>
  )
}

export { Counter }
