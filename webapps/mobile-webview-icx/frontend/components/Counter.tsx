import { ActorSubclass } from "@dfinity/agent"
import { useConnect } from "../services/hooks"
import React, { useEffect, useState } from "react"
import { canisterId, idlFactory } from "../../.dfx/local/canisters/counter"
import { _SERVICE as CounterService } from "../../.dfx/local/canisters/counter/counter.did"

const Counter = () => {
  /*
   * This how you use canisters throughout your app.
   */
  const { connected, icx } = useConnect()
  const [count, setCount] = useState<bigint>()

  const [counter, setCounter] = useState<
    ActorSubclass<CounterService> | undefined
  >(undefined)

  const initCounter = async () => {
    setCounter(await icx.createActor<CounterService>(canisterId, idlFactory))
  }

  const refreshCounter = async () => {
    const freshCount = (await counter.getValue()) as bigint
    setCount(freshCount)
  }

  const increment = async () => {
    await counter.increment()
    await refreshCounter()
  }

  useEffect(() => {
    if (connected) {
      console.log(counter)
      if (!counter) {
        ;(async () => await initCounter())()
      } else {
        refreshCounter()
      }
    }
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
