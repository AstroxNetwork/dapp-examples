<script setup lang="ts">
import logo from "../assets/dfinity.svg"
/*
 * Connect2ic provides essential utilities for IC app development
 */
import { reactive } from "vue"
import { createClient } from "@connect2ic/core"
import { defaultProviders } from "@connect2ic/core/providers"
import {
  ConnectButton,
  useConnect,
  useWallet,
  ConnectDialog,
  Connect2ICProvider,
} from "@connect2ic/vue"
import { tokenOptions, NFTOptions } from "../utils/"

import { idlFactory as exampleIdl } from "../candid/example.idl"
import type { _SERVICE as exampleService } from "../candid/example"

import "@connect2ic/core/style.css"
const { isConnected, connect, activeProvider, principal } = useConnect()
const [walletProvider] = useWallet()
const data = reactive({
  loading: false,
  balance: "0.0",
  newActor: null,
})

console.log('isConnected', isConnected)
console.log('isConnected', isConnected.value)

const queryBalance = async () => {
  data.loading = true
  const result = await walletProvider.queryBalance()
  console.log("queryBalance", JSON.stringify(result))
  data.balance = (result as any).value[0].amount
  data.loading = false
}

const createActor = async (values: { canisterId: string }) => {
  data.loading = true
  // @ts-ignore
  const { value: actor } = await activeProvider.createActor<exampleService>(
    values.canisterId,
    exampleIdl,
  )
  data.newActor = actor
  console.log("actor", actor)
  const result1 = await actor.created_apps()
  console.log("result1", result1)
  data.loading = false
}

// const handleConnect = async () => {
//   console.log('connect')
//   const result = connect((window as any).icx ? 'icx' : 'astrox');
//   console.log('result', result)
// }

const transferToken = async (values: { [key: string]: string }) => {
  data.loading = true
  const reuslt = await walletProvider.requestTransfer({
    to: values.to,
    standard: values.standard,
    symbol: values.symbol,
    amount: Number(values.amount),
  })
  console.log("transfer    end", reuslt)
  data.loading = false
}

const transferNFT = async (values: { [key: string]: string }) => {
  data.loading = true
  const reuslt = await walletProvider.requestTransferNFT({
    to: values.to,
    standard: values.standard,
    canisterId: values.canisterId,
    tokenIdentifier: values.tokenIdentifier,
    tokenIndex: Number(values.tokenIndex),
  })
  data.loading = false
}
</script>
  
  <template>
  <div class="App">
    <div class="auth-section">
      <ConnectButton />
    </div>
    <ConnectDialog />
    <header class="App-header">
      <img :src="logo" class="App-logo" alt="logo" />
      <p class="slogan">Connect2ic Vue example</p>
    </header>
    <a-space size="middle" direction="vertical">
      <a-row v-if="isConnected.value" :gutter="{ sm: 10, md: 24 }">
        <a-col :xs="{span: 24}" :md="{span: 12}">
          <a-button
            type="primary"
            :loading="data.loading"
            :onClick="queryBalance"
            >queryBalance</a-button
          >
          <p :style="{ marginTop: 10 }">Balance: {{ data.balance }}</p>
        </a-col>
        <a-col :xs="{span: 24}" md="{span: 12}">
          <a-form :onFinish="createActor">
            <a-form-item name="canisterId">
              <Input placeholder="canisterId" />
            </a-form-item>
            <a-button type="primary" :loading="data.loading" htmlType="submit"
              >createActor</a-button
            >
          </a-form>
        </a-col>
      </a-row>
      <div v-if="isConnected.value">
        <h2>Transaction example</h2>
        <a-row gutter="{ sm: 10, md: 24 }">
          <a-col :xs="{span: 24}" :md="{span: 12}">
            <a-form
              :initialValues="{
                standard: 'ICP',
                symbol: 'ICP',
              }"
              :onFinish="transferToken"
            >
              <a-form-item :labelCol="{ span: 6 }" name="amount" label="Amount">
                <Input placeholder="Amount" />
              </a-form-item>

              <a-form-item :labelCol="{ span: 6 }" name="to" label="To">
                <Input placeholder="To" />
              </a-form-item>
              <a-form-item
                :labelCol="{ span: 6 }"
                name="standard"
                label="Standard"
              >
                <Select
                  :style="{ maxWidth: 120 }"
                  :options="tokenOptions"
                  placeholder="Standard"
                >
                </Select>
              </a-form-item>
              <a-form-item :labelCol="{ span: 6 }" name="symbol" label="Symbol">
                <Select
                  :style="{ maxWidth: 120 }"
                  options="{tokenOptions}"
                  placeholder="Symbol"
                >
                </Select>
              </a-form-item>
              <div :style="{ textAlign: 'right' }">
                <a-button type="primary" loading="{loading}" htmlType="submit"
                  >Transfer Token</a-button
                >
              </div>
            </a-form>
          </a-col>
          <a-col :xs="{span: 24}" :md="{span: 12}">
            <a-form
              onFinish="{transferNFT}"
              :initialValues="{
                standard: 'EXT',
              }"
            >
              <a-form-item
                :labelCol="{ span: 6 }"
                name="tokenIdentifier"
                label="TokenIdentifier"
              >
                <Input placeholder="TokenIdentifier" />
              </a-form-item>
              <a-form-item
                :labelCol="{ span: 6 }"
                name="tokenIndex"
                label="TokenIndex"
              >
                <Input placeholder="TokenIndex" />
              </a-form-item>
              <a-form-item
                :labelCol="{ span: 6 }"
                name="canisterId"
                label="CanisterId"
              >
                <Input placeholder="CanisterId" />
              </a-form-item>
              <a-form-item :labelCol="{ span: 6 }" name="to" label="To">
                <Input placeholder="To" />
              </a-form-item>
              <a-form-item
                :labelCol="{ span: 6 }"
                name="standard"
                label="Standard"
              >
                <Select
                  :style="{ maxWidth: 120 }"
                  :options="NFTOptions"
                  placeholder="Standard"
                >
                </Select>
              </a-form-item>
              <div :style="{ textAlign: 'right' }">
                <a-button type="primary" loading="{loading}" htmlType="submit"
                  >Transfer NFT</a-button
                >
              </div>
            </a-form>
          </a-col>
        </a-row>
      </div>
    </a-space>
  </div>
</template>
  
<style>
body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen",
    "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue",
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #424242;
}

button {
  font-weight: 600;
}

.slogan {
  font-size: 1.7em;
  margin-bottom: 0;
}

.twitter {
  font-size: 0.4em;
}

.App-logo {
  height: 14vmin;
  pointer-events: none;
  transform: scale(1);
  animation: pulse 3s infinite;
}

.App-header {
  height: calc(100vh - 70px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: calc(10px + 2vmin);
}

.examples {
  padding: 30px 100px;
  display: grid;
  grid-gap: 30px;
  grid-template-columns: 1fr 1fr 1fr;
}

.examples-title {
  font-size: 1.3em;
  margin-bottom: 0;
  text-align: center;
}

.example {
  padding: 50px 50px;
  min-height: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  /*border: 1px solid black;*/
  /*background: #f4f4f4;*/
  border-radius: 15px;
}

.example-disabled {
  font-size: 1.3em;
  color: #9e9e9e;
}

.demo-button {
  background: #a02480;
  padding: 0 1.3em;
  margin-top: 1em;
  border-radius: 60px;
  font-size: 0.7em;
  height: 35px;
  outline: 0;
  border: 0;
  cursor: pointer;
  color: white;
}

.demo-button:active {
  color: white;
  background: #979799;
}

.auth-section {
  padding: 1em;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  text-align: right;
  position: fixed;
  top: 0;
  right: 0;
}

@keyframes pulse {
  0% {
    transform: scale(0.97);
    opacity: 0;
  }

  70% {
    transform: scale(1);
    opacity: 1;
  }

  100% {
    transform: scale(0.97);
    opacity: 0;
  }
}
</style>
  