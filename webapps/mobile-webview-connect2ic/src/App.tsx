import React, { useEffect, useState } from "react"
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
import { idlFactory } from './candid/ego_icp.idl'
import { Principal } from "@dfinity/principal"
import { CreateActorResult, createClient } from "@connect2ic/core"
import {
  AstroX,
  defaultProviders,
  ICX,
  walletProviders,
} from "@connect2ic/core/providers"
/*
 * Import connect2ic  css
 */
import "@connect2ic/core/style.css"
import 'antd/dist/antd.css'
import { NFTOptions, tokenOptions } from "./utils"
import { _SERVICE } from "./candid/ego_icp"
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
  const [walletProvider] = useWallet()
  const [total, setTotal] = useState("0.0")
  const [balance, setBalance] = useState<boolean | string>(false)
  const [loading, setLoading] = useState(false)
  const [newActor, setNewActor] = useState<CreateActorResult<_SERVICE>>()

  console.log(client)
  useEffect(() => {
    if (isConnected) {
     
    }
  }, [isConnected])

  const queryBalance = async () => {
    const result = await walletProvider.queryBalance()
    console.log('queryBalance', JSON.stringify(result))
    // console.log('queryBalance', result.find(o => o.symbol ==='ICP'))
    setBalance((result as any).value[0].amount)
  }

  const createActor = async (values: { canisterId: string }) => {
    const result = await activeProvider.createActor<_SERVICE>(values.canisterId, idlFactory)
    console.log('createActor', result)
    setNewActor(result)
  }
  const connect = async () => {
    console.log('connect')
    const result = await activeProvider.connect();
    console.log('result', result)
  }

  const transferToken = async (values) => {
    const reuslt = await (activeProvider as ICX).requestTransfer({
      to: values.to,
      standard: values.standard,
      symbol: values.symbol,
      amount: values.amount,
    })
    console.log('transfer    end', reuslt)
  }

  const transferNFT = async (values) => {
    const reuslt = await walletProvider.requestTransferNFT({
      to: values.to,
      standard: values.standard,
      canisterId: values.canisterId,
      tokenIdentifier: values.tokenIdentifier,
      tokenIndex: values.tokenIndex,
    })
    console.log('transfer    end', reuslt)
  }
  console.log(activeProvider)
  const onChangeAmount = (value) => {

    console.log(value)

    const total = balanceToString(
      balanceFromString(value, 8) + balanceFromString('0.0001', 8),
      8,
    ).formatTotalTo4
    setTotal(total)
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
        <div style={{ textAlign: 'center' }}>
          {
            isConnected ? (
              null
            ) : (
              <>
                <Button type="primary" onClick={connect}>Connect</Button>
                {/* <Form onFinish={connect}>
                  <Form.Item
                    labelCol={{ span: 6 }}
                    name="canisterIds"
                    label="CanisterIds"
                  >
                    <Input.TextArea placeholder='CanisterIds' rows={3} />
                  </Form.Item>
                  <Button type="primary" htmlType="submit">Connect</Button>
                </Form> */}
              </>
            )
          }
        </div>
        {
          isConnected ? (
            <Row gutter={{ sm: 10, md: 24 }}>
              <Col xs={24} md={12}>
                <Button type="primary" onClick={queryBalance}>queryBalance</Button>
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
                  <Button type="primary" htmlType="submit">createActor</Button>
                </Form>
              </Col>
            </Row>
          ) : null
        }
        <h3>Transaction example</h3>
        <Row gutter={{ sm: 10, md: 24 }}>
          {
            isConnected ? (
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
                    <Input placeholder='Amount' onChange={onChangeAmount} />
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
                    <Button type="primary" htmlType="submit" >Transfer Token</Button>
                  </div>
                </Form>
              </Col>
            ) : null
          }
          {
            isConnected ? (
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
                    <Button type="primary" htmlType="submit" >Transfer NFT</Button>
                  </div>
                </Form>
              </Col>
            ) : null
          }

        </Row>
        {
          isConnected ? (
            <Descriptions
              title="Authenticate Info"
              size="default"
              column={1}
            // extra={<Button type="primary">Edit</Button>}
            >
              <Descriptions.Item label="Principal ID">{principal}</Descriptions.Item>
              <Descriptions.Item label="Wallet">{
                walletProvider?.address().principal
              }</Descriptions.Item>
            </Descriptions>
          ) : null
        }
      </Space>
    </div>
  )
}

const client = createClient({
  // providers: walletProviders,
  providers: [
    new AstroX({
      // providerUrl: "http://localhost:8080/",
      // whitelist: ["ryjl3-tyaaa-aaaaa-aaaba-cai"],
    }),
  ],
  globalProviderConfig: {
    // dev: true,
    // ledgerCanisterId: "ryjl3-tyaaa-aaaaa-aaaba-cai",
    // ledgerHost: "http://localhost:8000",
    // whitelist: ["ryjl3-tyaaa-aaaaa-aaaba-cai"],
  },
})

export default () => (
  <Connect2ICProvider client={client}>
    <App />
  </Connect2ICProvider>
)
