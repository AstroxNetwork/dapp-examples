import { useConnect } from "@connect2ic/react"
import { ActorSubclass } from "@dfinity/agent"
// import { useConnect } from "../services/hooks"
import React, { useEffect, useState } from "react"
import { idlFactory } from "../../.dfx/local/canisters/counter"
import { _SERVICE as CounterService } from "../../.dfx/local/canisters/counter/counter.did"

const Counter = () => {
  /*
   * This how you use canisters throughout your app.
   */
  const { activeProvider, isConnected } = useConnect()
  const [count, setCount] = useState<bigint>()

  const [counter, setCounter] = useState<
    ActorSubclass<CounterService> | undefined
  >(undefined)

  const initCounter = async () => {
    console.log("initCounter")
    // console.log(icx)
    const actorResult = await activeProvider.createActor<CounterService>(
      "zumxp-jiaaa-aaaah-abp7a-cai",
      idlFactory,
    )
    setCounter(actorResult.unwrapOr(undefined))

    // setCounter(await activeProvider.createActor<CounterService>(canisterId, idlFactory).un)
  }

  const refreshCounter = async () => {
    const freshCount = (await counter.getValue()) as bigint
    setCount(freshCount)
  }

  const increment = async () => {
    console.log({ isConnected })
    if (counter) {
      await counter.increment()
      await refreshCounter()
    }
  }

  useEffect(() => {
    if (isConnected) {
      console.log("counter")
      if (!counter) {
        console.log("counter is not found")
        ;(async () => await initCounter())()
      } else {
        refreshCounter()
      }
    }
    console.log("useEffect")
  }, [isConnected, counter])

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
