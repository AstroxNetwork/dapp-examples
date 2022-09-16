import React, { ChangeEvent, useEffect, useState } from "react"
import logo from "./assets/dfinity.svg"
/*
 * Import canister definitions like this:
 */
import { Button, Divider, Form, Input, Select, Space, Col, Descriptions, Row } from "antd"

import {
  useConnect,
  useTransfer,
  ConnectButton,
  Connect2ICProvider,
  useBalance,
  useWallet,
  ConnectDialog,
  useClient,
} from "@connect2ic/react"
import { balanceFromString, balanceToString } from "./utils/converters"
import { randomBytes } from "./utils/random"
import { fromHexString } from "@dfinity/candid"
import { idlFactory } from './candid/example.idl'
import { Principal } from "@dfinity/principal"
import { CreateActorResult, createClient } from "@connect2ic/core"
import {
  AstroX,
  ICX,
  defaultProviders,
  PlugWallet,
  InfinityWallet,
  NFID,
  StoicWallet,
  InternetIdentity,
  walletProviders,
} from "@connect2ic/core/providers"
/*
 * Import connect2ic  css
 */
import "@connect2ic/core/style.css"
import 'antd/dist/antd.css'
import { NFTOptions, tokenOptions } from "./utils"
import { _SERVICE } from "./candid/example"
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
  const { isConnected, activeProvider, principal } = useConnect()
  const client = useClient()
  const { connect } = useConnect()
  const [walletProvider] = useWallet()
  const [total, setTotal] = useState("0.0")
  const [balance, setBalance] = useState<boolean | string>(false)
  const [loading, setLoading] = useState(false)
  const [newActor, setNewActor] = useState<CreateActorResult<_SERVICE>>()

  useEffect(() => {
    if (isConnected) {
      console.log('walletProvider', walletProvider)
      console.log('activeProvider', activeProvider)
    }
  }, [isConnected])

  const queryBalance = async () => {
    setLoading(true)
    const result = await walletProvider.queryBalance()
    console.log('queryBalance', JSON.stringify(result))
    setBalance((result as any).value[0].amount)
    setLoading(false)
  }

  const createActor = async (values: { canisterId: string }) => {
    setLoading(true)
    const result = await activeProvider.createActor<_SERVICE>(values.canisterId, idlFactory)
    console.log('createActor', result)
    setNewActor(result)
    setLoading(false)
  }

  // const handleConnect = async () => {
  //   console.log('connect')
  //   const result = connect((window as any).astrox_webview ? 'icx' : 'astrox');
  //   console.log('result', result)
  // }

  const transferToken = async (values: {
    [key: string]: string
  }) => {
    setLoading(true)
    const reuslt = await walletProvider.requestTransfer({
      to: values.to,
      standard: values.standard,
      symbol: values.symbol,
      amount: Number(values.amount),
    })
    console.log('transfer    end', reuslt)
    setLoading(false)
  }

  const transferNFT = async (values: {
    [key: string]: string
  }) => {
    setLoading(true)
    const reuslt = await walletProvider.requestTransferNFT({
      to: values.to,
      standard: values.standard,
      canisterId: values.canisterId,
      tokenIdentifier: values.tokenIdentifier,
      tokenIndex: Number(values.tokenIndex),
    })
    setLoading(false)
  }

  return (
    <div className="container">
      <div className="auth-section">
        <ConnectButton />
      </div>
      <ConnectDialog />
      <h1 style={{ textAlign: "center", marginBottom: 30 }}>
        Connect2ic Example
      </h1>
      <Space size="middle" direction="vertical">
        {/* <div style={{ textAlign: 'center' }}>
          {
            isConnected ? (
              null
            ) : (
              <>
                <Button type="primary" onClick={handleConnect}>Connect</Button>
              </>
            )
          }
        </div> */}
        {
          isConnected ? (
            <Row gutter={{ sm: 10, md: 24 }}>
              <Col xs={24} md={12}>
                <Button type="primary" loading={loading} onClick={queryBalance}>queryBalance</Button>
                {
                  balance !== undefined ?
                    <p style={{ marginTop: 10 }}>Balance: {balance}</p> : null
                }
              </Col>
              <Col xs={24} md={12}>
                <Form onFinish={createActor}>
                  <Form.Item name="canisterId">
                    <Input placeholder='canisterId' />
                  </Form.Item>
                  <Button type="primary" loading={loading} htmlType="submit">createActor</Button>
                </Form>
              </Col>
            </Row>
          ) : null
        }
        {
          isConnected ? (
            <>
              <h2>Transaction example</h2>
              <Row gutter={{ sm: 10, md: 24 }}>
                <Col xs={24} md={12}>
                  <Form
                    initialValues={{
                      standard: 'ICP',
                      symbol: 'ICP'
                    }}
                    onFinish={transferToken}>
                    <Form.Item
                      labelCol={{ span: 6 }}
                      name="amount"
                      label="Amount"

                    >
                      <Input placeholder='Amount' />
                    </Form.Item>

                    <Form.Item
                      labelCol={{ span: 6 }}
                      name="to"
                      label="To"
                    >
                      <Input placeholder='To' />
                    </Form.Item>
                    <Form.Item
                      labelCol={{ span: 6 }}
                      name="standard"
                      label="Standard"
                    >
                      <Select
                        style={{ maxWidth: 120 }}
                        options={tokenOptions}
                        placeholder="Standard"
                      >
                      </Select>
                    </Form.Item>
                    <Form.Item
                      labelCol={{ span: 6 }}
                      name="symbol"
                      label="Symbol"
                    >
                      <Select
                        style={{ maxWidth: 120 }}
                        options={tokenOptions}
                        placeholder="Symbol"
                      >
                      </Select>
                    </Form.Item>
                    <div style={{ textAlign: 'right' }}>
                      <Button type="primary" loading={loading} htmlType="submit" >Transfer Token</Button>
                    </div>
                  </Form>
                </Col>
                <Col xs={24} md={12}>
                  <Form
                    onFinish={transferNFT}
                    initialValues={{
                      standard: 'EXT',
                    }}
                  >
                    <Form.Item
                      labelCol={{ span: 6 }}
                      name="tokenIdentifier"
                      label="TokenIdentifier"
                    >
                      <Input placeholder='TokenIdentifier' />
                    </Form.Item>
                    <Form.Item
                      labelCol={{ span: 6 }}
                      name="tokenIndex"
                      label="TokenIndex"
                    >
                      <Input placeholder='TokenIndex' />
                    </Form.Item>
                    <Form.Item
                      labelCol={{ span: 6 }}
                      name="canisterId"
                      label="CanisterId"
                    >
                      <Input placeholder='CanisterId' />
                    </Form.Item>
                    <Form.Item
                      labelCol={{ span: 6 }}
                      name="to"
                      label="To"
                    >
                      <Input placeholder='To' />
                    </Form.Item>
                    <Form.Item
                      labelCol={{ span: 6 }}
                      name="standard"
                      label="Standard"
                    >
                      <Select
                        style={{ maxWidth: 120 }}
                        options={NFTOptions}
                        placeholder="Standard"
                      >
                      </Select>
                    </Form.Item>
                    <div style={{ textAlign: 'right' }}>
                      <Button type="primary" loading={loading} htmlType="submit" >Transfer NFT</Button>
                    </div>
                  </Form>
                </Col>
              </Row>
            </>
          ) : null
        }
        {
          isConnected ? (
            <>
              <Descriptions
                title="Authenticate Identity Info"
                size="default"
                column={1}
              >
                <Descriptions.Item label="Principal ID">{principal}</Descriptions.Item>

              </Descriptions>
              <Descriptions
                title="Authenticate Wallet Info"
                size="default"
                column={1}
              >
                <Descriptions.Item label="Principal">
                  {walletProvider.wallets[0].principal}
                </Descriptions.Item>
                <Descriptions.Item label="AccountId">
                  {walletProvider.wallets[0].accountId}
                </Descriptions.Item>
              </Descriptions>
            </>


          ) : null
        }
      </Space>
    </div>
  )
}

console.log('agent', navigator.userAgent)
const client = createClient({
  providers: defaultProviders,
  // providers: [
  //   // defaultProviders,
  //   (window as any).astrox_webview ? new ICX({
  //     // providerUrl: "https://ccmhe-vqaaa-aaaai-acmoq-cai.raw.ic0.app/",
  //     // providerUrl: "http://localhost:8080/",
  //   }) :
  //     new AstroX({
  //       // providerUrl: "https://ccmhe-vqaaa-aaaai-acmoq-cai.raw.ic0.app/",
  //       // providerUrl: "http://localhost:8080/",
  //     }),

  // ],
  globalProviderConfig: {
    // dev: import.meta.env.DEV,
    dev: true,
    ledgerCanisterId: "ryjl3-tyaaa-aaaaa-aaaba-cai",
    ledgerHost: "http://localhost:8000",
    // whitelist: ["ryjl3-tyaaa-aaaaa-aaaba-cai"],
    whitelist: ['qsgjb-riaaa-aaaaa-aaaga-cai', 'qhbym-qaaaa-aaaaa-aaafq-cai',],
  },
})

export default () => (
  <Connect2ICProvider client={client}>
    <App />
  </Connect2ICProvider>
)
