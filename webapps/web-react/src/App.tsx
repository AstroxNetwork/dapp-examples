import { useState, useEffect, useRef } from 'react'
import reactLogo from './assets/react.svg'
import { Row, Space, Button, Col, Card, Form, Descriptions, Input, Select } from 'antd'
import './App.less'
import 'antd/dist/antd.css'
import { IC } from '@astrox/sdk-web';
import { TransferNFTWithIdentifier, TransferToken } from '@astrox/sdk-core';
import { NFTOptions, tokenOptions } from './utils';
// @ts-ignore
import { idlFactory as bucketIdl } from './canisters/ego_bucket.idl';
import { TransactionNFT, TransactionOptions, TransactionToken } from '@astrox/sdk-web/build/types'

function App() {
  const [count, setCount] = useState(0)
  const [balance, setBalance] = useState()
  const [isConnect, setIsConnect] = useState(false)
  const [icProvider, setIcProvider] = useState<IC>();
  const [delegationTargets, setDelegationTargets ] = useState<string[]>()
  const IcRef = useRef<IC>()

  useEffect(() => {
    checkConnect();
    // client.client.
  }, [])


  const checkConnect = async () => {
    IcRef.current = await IC.create({
      useFrame: document.body.clientWidth > 768 ? true : undefined,
      signerProviderUrl: 
      'https://63k2f-nyaaa-aaaah-aakla-cai.raw.ic0.app/signer',
      // 'https://ccmhe-vqaaa-aaaai-acmoq-cai.raw.ic0.app/signer',
      //  'http://localhost:3000/signer',
      identityProvider: 
      `https://63k2f-nyaaa-aaaah-aakla-cai.raw.ic0.app/login#authorize`,
      // `https://ccmhe-vqaaa-aaaai-acmoq-cai.raw.ic0.app/login#authorize`,
      //  'http://localhost:3000/login#authorize',
      walletProviderUrl: 
      `https://63k2f-nyaaa-aaaah-aakla-cai.raw.ic0.app/transaction`,
      // `https://ccmhe-vqaaa-aaaai-acmoq-cai.raw.ic0.app/transaction`,
      //  'http://localhost:3000/transaction', 
      //  dev: true,
      onAuthenticated: async (icInstance: IC) => {

      },
    });
    const result = await IcRef.current?.isAuthenticated()
    if (result) {
      setIsConnect(true);
      (window as any).icx = IcRef.current;
      setIcProvider(IcRef.current)
    }
    console.log('result', result)

  }

  const connect = async (values: { canisterIds: string }) => {
    const result = await IcRef.current?.connect({
      useFrame: !(window.innerWidth < 768),
      signerProviderUrl: 
      'https://63k2f-nyaaa-aaaah-aakla-cai.raw.ic0.app/signer',
      // 'https://ccmhe-vqaaa-aaaai-acmoq-cai.raw.ic0.app/signer',
      //  'http://localhost:3000/signer',
      identityProvider: 
      `https://63k2f-nyaaa-aaaah-aakla-cai.raw.ic0.app/login#authorize`,
      // `https://ccmhe-vqaaa-aaaai-acmoq-cai.raw.ic0.app/login#authorize`,
      //  'http://localhost:3000/login#authorize',
      walletProviderUrl: 
      `https://63k2f-nyaaa-aaaah-aakla-cai.raw.ic0.app/transaction`,
      // `https://ccmhe-vqaaa-aaaai-acmoq-cai.raw.ic0.app/transaction`,
      //  'http://localhost:3000/transaction', 
      delegationTargets: values.canisterIds.split(','),
      customDomain: 'http://ssdd.ww22222.com',
      // delegationModes: ['global'],
      // dev: true,
      // host: 'http://ssdd.ww.com',
      maxTimeToLive: BigInt(new Date().getTime() + 1000 * 60 * 60 * 24),
      onAuthenticated: async (icInstance: IC) => {
        setIsConnect(true);
        (window as any).icx = icInstance;
        setIcProvider(icInstance)
        setDelegationTargets(icInstance.delegationTargets)
      },
    });

  }

  const queryBalance = async () => {
    const result = await IcRef.current?.queryBalance()
    console.log('queryBalance', result)
    // console.log('queryBalance', result.find(o => o.symbol ==='ICP'))
    // setBalance(result)
  }

  const createActor = async (values: { canisterId: string }) => {
    const result = await IcRef.current?.createActor(bucketIdl, values.canisterId)
    console.log('createActor', result)
    setDelegationTargets(IcRef.current?.delegationTargets)
  }
  const disconnect = async () => {
    const result = await IcRef.current?.disconnect();
    setIsConnect(false)
    console.log('disconnect', result)
  }

  const transferToken = async (values: {[key: string]: string}) => {
    const reuslt = await IcRef.current?.requestTransfer({
      to: values.to,
      standard: values.standard,
      symbol: values.symbol,
      amount: BigInt(values.amount),
      sendOpts: {
        memo: BigInt(values.memo),
        from_subaccount: values.fromSubAccount ? [Number(values.fromSubAccount)]: undefined
      }
    })
    console.log('transfer    end', reuslt)
  }

  const transferNFT = async (values: {[key: string]: string}) => {
    const reuslt = await IcRef.current?.requestTransfer({
      to: values.to,
      standard: values.standard,
      canisterId: values.canisterId,
      tokenIdentifier: values.tokenIdentifier,
      tokenIndex: Number(values.tokenIndex),
      sendOpts: {
        memo: [Number(values.memo)],
      }
    })

    console.log('transfer    end', reuslt)
  }

  return (
    <Space size="middle" direction="vertical">
      <h1 style={{ marginTop: 30 }}>AstroX sdk test</h1>
      <div style={{ textAlign: 'center' }}>
        {
          isConnect ? (
            <>

              <Button type="default" onClick={disconnect}>Disconnect</Button>

            </>
          ) : (
            <>
              <Form onFinish={connect}>
                <Form.Item
                  labelCol={{ span: 6 }}
                  name="canisterIds"
                  label="CanisterIds"
                >
                  <Input.TextArea placeholder='CanisterIds' rows={3} />
                </Form.Item>
                <Button type="primary" htmlType="submit">Connect</Button>
              </Form>
            </>
          )
        }
      </div>
      {
        isConnect ? (
          <div style={{ textAlign: 'right' }}>
            <Button type="primary" onClick={queryBalance}>queryBalance</Button>
            {
              balance ?
                <p>Balance: {balance}</p> : null
            }
            {
              delegationTargets ? (
                <p>DelegationTargets:{delegationTargets.toString()}</p>
              ) : null
            }
            <Form onFinish={createActor}>
              <Form.Item name="canisterId">
                <Input placeholder='canisterId' />
              </Form.Item>
              <Button type="primary" htmlType="submit">createActor</Button>
            </Form>
          </div>
        ) : null
      }
      <Row gutter={{ sm: 10, md: 24 }}>
        {
          isConnect ? (
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
                  name="memo"
                  label="Memo"
                >
                  <Input placeholder='Memo' />
                </Form.Item>
                <Form.Item
                  labelCol={{ span: 6 }}
                  name="fromSubAccount"
                  label="FromSubAccount"
                >
                  <Input placeholder='FromSubAccount' />
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
          isConnect ? (
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
                  name="memo"
                  label="Memo"
                >
                  <Input placeholder='Memo' />
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
        isConnect ? (
          <Descriptions
            title="Authenticate Info"
            size="default"
            column={1}
          // extra={<Button type="primary">Edit</Button>}
          >
            <Descriptions.Item label="Principal ID">{IcRef.current?.principal.toText()}</Descriptions.Item>
            <Descriptions.Item label="DelegationTargets">{IcRef.current?.delegationTargets}</Descriptions.Item>
            <Descriptions.Item label="Wallet">
              <p>AccountId: {IcRef.current?.wallet?.accountId}</p>
              <p>Principal: {IcRef.current?.wallet?.principal}</p>
            </Descriptions.Item>
            <Descriptions.Item label="Identity">{IcRef.current?.identity.getPrincipal.toString()}</Descriptions.Item>
          </Descriptions>
        ) : null
      }
    </Space>
  )
}

export default App
