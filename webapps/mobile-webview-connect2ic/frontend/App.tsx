import React, { useEffect, useState } from "react"
import logo from "./assets/dfinity.svg"

/*
 * Import canister definitions like this:
 */
import * as counter from "../.dfx/local/canisters/counter"
import { Button, Divider, DotLoading, Form, Input, Space } from "antd-mobile"
import { idlFactory } from "../.dfx/local/canisters/counter"

// import { Counter } from "./components/Counter"
// import { Profile } from "./components/Profile"
// import { Transfer } from "./components/Transfer"

import {
  useConnect,
  useTransfer,
  ConnectButton,
  Connect2ICProvider,
  useBalance,
  useWallet,
  ConnectDialog,
} from "@connect2ic/react"
import { balanceFromString, balanceToString } from "./utils/converters"
import { randomBytes } from "./utils/random"
import { fromHexString } from "@dfinity/candid"
import { Principal } from "@dfinity/principal"
import { createClient } from "@connect2ic/core"
import {
  AstroX,
  defaultProviders,
  walletProviders,
} from "@connect2ic/core/providers"
import { Counter } from "./components/Counter"

// const ConnectButton = ({
//   onClick,
//   text,
// }: {
//   onClick: () => Promise<void>
//   text: string
// }) => {
//   return (
//     <>
//       <Button onClick={onClick}>{text}</Button>
//     </>
//   )
// }

function App() {
  const { isConnected, activeProvider } = useConnect()
  const [walletProvider] = useWallet()
  const [connected, setConnected] = useState(false)
  const [principal, setPrincipal] = useState<string>("")
  const [fee, setFee] = useState("0")
  const [total, setTotal] = useState("0.0")
  // const [balance, setBalance] = useState<boolean | string>(false)
  const [loading, setLoading] = useState(false)
  const [amount, setAmount] = useState<bigint>(BigInt(0))
  const [to, setTo] = useState<string>("")
  // const [noAuto, setNoAuto] = useState<boolean>(false)

  // const [assets] = useBalance()
  // console.log(assets)

  useEffect(() => {
    if (isConnected) {
      ;(async () => {
        const b = await walletProvider.queryBalance()
        console.log(b)
      })()
    }
  }, [isConnected])

  // const connectICX = async () => {
  //   await icx.connect({
  //     delegationTargets: [counter.canisterId],
  //     host: window.origin,
  //   })
  //   if (icx.getPrincipal().isAnonymous()) {
  //     setConnected(false)
  //   } else {
  //     setConnected(true)
  //   }
  // }
  // const getBalance = async () => {
  //   console.log("getBalance")
  //   const balance = await activeProvider.queryBalance()
  //   console.log("getBalance", balance)
  //   setBalance(balance[0].amount.toString())
  // }

  const disConnect = async () => {
    // setNoAuto(true)
    setConnected(false)
    setPrincipal("")
    setAmount(BigInt(0))
    // setBalance("0")
    setFee("0")
    setTo("")
    // await activeProvider.disconnect()
  }

  const onFinish = async () => {
    // await walletProvider.requestTransfer({
    //   symbol: "ICP",
    //   standard: "ICP",
    //   amount: Number(1),
    //   to,
    // })
  }

  const onChangeAmount = (value: string) => {
    console.log(balanceFromString(value, 8))
    setAmount(balanceFromString(value, 8))

    const total = balanceToString(
      balanceFromString(value, 8) + balanceFromString(fee, 8),
      8,
    ).formatTotalTo4
    setTotal(total)
  }

  const onChangeTo = (value: string) => {
    setTo(value)
  }

  return (
    <div className="container">
      <p style={{ marginRight: 10 }}>{principal}</p>
      <div className="auth-section">
        <ConnectButton />
      </div>
      <ConnectDialog />
      <h1 style={{ textAlign: "center", marginBottom: 30 }}>
        Transaction Example
      </h1>
      <Form
        onFinish={onFinish}
        style={{ "--border-bottom": "0px", "--border-top": "0px" }}
        initialValues={{
          toAddress: "",
        }}
      >
        <Form.Item
          className="adm-list-item-input adm-input-textLeft"
          name="toAddress"
          label="Recipient's Address"
          // extra={<IconFont name="address" size={22} />}
          // disabled
          rules={[
            {
              required: true,
              message: "Please enter Principal ID.",
            },
          ]}
        >
          <Input
            placeholder="Principal ID (Wallet address)"
            onChange={onChangeTo}
          />
        </Form.Item>
        <Form.Item
          name="amount"
          label="Amount"
          extra={<span>ICP</span>}
          rules={[
            {
              required: true,
              message: "Please enter amount.",
            },
          ]}
        >
          <Input placeholder="Amount" onChange={onChangeAmount} />
        </Form.Item>

        {/* <Space style={{ marginTop: 20 }}>
          Balance: {balance === false ? <DotLoading /> : balance}
        </Space> */}
        <Divider style={{ marginTop: 20 }} />
        <div style={{}}>
          {/* <p>From:</p>
          <p>{connected ? icx.address().accountId : ""}</p> */}
          <Space justify="between" block style={{ marginTop: 20 }}>
            Network Fee
            <span>{fee}ICP</span>
          </Space>
          <Space justify="between" block>
            Total
            <span>{total}ICP</span>
          </Space>
        </div>
        <Button
          className="send-button"
          type="submit"
          loading={loading}
          color="primary"
        >
          Send
        </Button>
        <Button
          className="send-button"
          type="submit"
          onClick={async () => {
            console.log("fucking hell")
            // await activeProvider.createActor(
            //   Principal.fromUint8Array(
            //     new Uint8Array(fromHexString(randomBytes(10))),
            //   ).toText(),
            //   idlFactory,
            // )
          }}
          color="primary"
        >
          Add Targets(global)
        </Button>
        <Button
          className="send-button"
          style={{ marginTop: 20 }}
          type="button"
          color="default"
          onClick={() => {
            // window.open(
            //   `https://icscan.io/account/${
            //     connected ? walletProvider : ""
            //   }`,
            // )
          }}
        >
          Transaction History
        </Button>
      </Form>
      <div className="examples">
        fuck
        {/* <Counter /> */}
        {/* <Profile />
        <Transfer /> */}
      </div>
    </div>
  )
}

const client = createClient({
  canisters: {
    counter,
  },
  // providers: walletProviders,
  providers: [
    new AstroX({
      // providerUrl: "https://ccmhe-vqaaa-aaaai-acmoq-cai.raw.ic0.app/",
      providerUrl: "http://localhost:8080/",

      // whitelist: ["ryjl3-tyaaa-aaaaa-aaaba-cai"],
    }),
  ],
  globalProviderConfig: {
    // dev: import.meta.env.DEV,
    dev: true,
    ledgerCanisterId: "ryjl3-tyaaa-aaaaa-aaaba-cai",
    ledgerHost: "http://localhost:8000",
    // whitelist: ["ryjl3-tyaaa-aaaaa-aaaba-cai"],
  },
})

export default () => (
  <Connect2ICProvider client={client}>
    <App />
  </Connect2ICProvider>
)
