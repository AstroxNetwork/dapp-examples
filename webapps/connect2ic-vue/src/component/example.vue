<script setup lang="ts">
import logo from "../assets/dfinity.svg"
import { onMounted, reactive, toRaw, watch } from "vue"
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

interface FormState {
  canisterId: string
  amount: string
  to: string
  standard: string
  symbol: string
  tokenIdentifier: string
  tokenIndex: string
  memo: string
}

const { isConnected, connect, activeProvider, provider, principal } =
  useConnect()
const [walletProvider] = useWallet()
const data = reactive({
  loading: false,
  balance: "0.0",
  newActor: null,
})

const formState = reactive<FormState>({
  canisterId: "",
  amount: "",
  to: "",
  standard: "",
  symbol: "",
  tokenIdentifier: "",
  tokenIndex: "",
  memo: "",
})

// onMounted(() => {
//   console.log('onMounted')
//   setTimeout(()=> {
//     handleConnect()
//   }, 1000)
// })

watch(activeProvider, (activeProvider, prevProvider) => {
  /* ... */
})

const queryBalance = async () => {
  data.loading = true
  const result = await activeProvider.value.queryBalance()
  console.log("queryBalance", JSON.stringify(result))
  data.balance = (result as any).value[0].amount
  data.loading = false
}

const createActor = async (values: { canisterId: string }) => {
  console.log("createActor", values, formState)
  console.log("canisterId", toRaw(formState))
  data.loading = true
  // @ts-ignore
  const { value: actor } =
    await activeProvider.value.createActor<exampleService>(
      formState.canisterId,
      exampleIdl,
    )
  data.newActor = actor
  console.log("actor", actor)
  const result1 = await actor.created_apps()
  console.log("result1", result1)
  data.loading = false
}

const handleConnect = async () => {
  console.log("connect")

  const result = await connect((window as any).icx ? "icx" : "astrox")
  console.log("result", result)
}

const transferToken = async () => {
  console.log("transferToken", formState)
  data.loading = true
  const reuslt = await activeProvider.value.requestTransfer({
    to: formState.to,
    standard: formState.standard,
    symbol: formState.symbol,
    amount: Number(formState.amount),
    memo: BigInt(formState.memo),
  })
  console.log("transfer    end", reuslt)
  data.loading = false
}

const transferNFT = async (values: { [key: string]: string }) => {
  console.log("transferToken", formState)
  data.loading = true
  const reuslt = await activeProvider.value.requestTransferNFT({
    to: formState.to,
    standard: formState.standard,
    canisterId: formState.canisterId,
    tokenIdentifier: formState.tokenIdentifier,
    tokenIndex: Number(formState.tokenIndex),
    memo: BigInt(formState.memo),
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
    <h1
      :style="{ marginBottom: '30px', marginTop: '90px', textAlign: 'center' }"
    >
      Connect2ic Vue Example
    </h1>
    <!-- <a-space size="middle" direction="vertical"> -->
    <a-row v-if="isConnected" :gutter="{ sm: 10, md: 24 }">
      <a-col :xs="{ span: 24 }" :md="{ span: 12 }">
        <a-button type="primary" :loading="data.loading" @click="queryBalance"
          >queryBalance</a-button
        >
        <p :style="{ marginTop: 10 }">Balance: {{ data.balance }}</p>
      </a-col>
      <a-col :xs="{ span: 24 }" :md="{ span: 12 }">
        <a-form>
          <a-form-item name="canisterId">
            <a-input
              placeholder="canisterId"
              v-model:value="formState.canisterId"
            />
          </a-form-item>
          <a-form-item :wrapper-col="{ offset: 8, span: 16 }">
            <a-button
              type="primary"
              :loading="data.loading"
              @click="createActor"
              >createActor</a-button
            >
          </a-form-item>
        </a-form>
      </a-col>
    </a-row>
    <div v-if="isConnected">
      <h2>Transaction example</h2>
      <a-row :gutter="{ sm: 12, md: 24 }">
        <a-col :xs="{ span: 24 }" :md="{ span: 12 }">
          <a-form
            :initialValues="{
              standard: 'ICP',
              symbol: 'ICP',
            }"
          >
            <a-form-item :labelCol="{ span: 6 }" name="amount" label="Amount">
              <a-input placeholder="Amount" v-model:value="formState.amount" />
            </a-form-item>

            <a-form-item :labelCol="{ span: 6 }" name="to" label="To">
              <a-input placeholder="To" v-model:value="formState.to" />
            </a-form-item>
            <a-form-item :labelCol="{ span: 6 }" name="memo" label="Memo">
              <a-input placeholder="Memo" v-model:value="formState.memo" />
            </a-form-item>
            <a-form-item
              :labelCol="{ span: 6 }"
              name="standard"
              label="Standard"
            >
              <a-select
                :style="{ maxWidth: 120 }"
                :options="tokenOptions"
                placeholder="Standard"
                v-model:value="formState.standard"
              >
              </a-select>
            </a-form-item>
            <a-form-item :labelCol="{ span: 6 }" name="symbol" label="Symbol">
              <a-select
                :style="{ maxWidth: 120 }"
                :options="tokenOptions"
                placeholder="Symbol"
                v-model:value="formState.symbol"
              >
              </a-select>
            </a-form-item>
            <div :style="{ textAlign: 'right' }">
              <a-button
                type="primary"
                :loading="data.loading"
                @click.prevent="transferToken"
                >Transfer Token</a-button
              >
            </div>
          </a-form>
        </a-col>
        <a-col :xs="{ span: 24 }" :md="{ span: 12 }">
          <a-form
            :initialValues="{
              standard: 'EXT',
            }"
          >
            <a-form-item
              :labelCol="{ span: 6 }"
              name="tokenIdentifier"
              label="TokenIdentifier"
            >
              <a-input
                placeholder="TokenIdentifier"
                v-model:value="formState.tokenIdentifier"
              />
            </a-form-item>
            <a-form-item
              :labelCol="{ span: 6 }"
              name="tokenIndex"
              label="TokenIndex"
            >
              <a-input
                placeholder="TokenIndex"
                v-model:value="formState.tokenIndex"
              />
            </a-form-item>
            <a-form-item
              :labelCol="{ span: 6 }"
              name="canisterId"
              label="CanisterId"
            >
              <a-input
                placeholder="CanisterId"
                v-model:value="formState.canisterId"
              />
            </a-form-item>
            <a-form-item :labelCol="{ span: 6 }" name="to" label="To">
              <a-input placeholder="To" v-model:value="formState.to" />
            </a-form-item>
            <a-form-item :labelCol="{ span: 6 }" name="memo" label="Memo">
              <a-input placeholder="Memo" v-model:value="formState.memo" />
            </a-form-item>
            <a-form-item
              :labelCol="{ span: 6 }"
              name="standard"
              label="Standard"
            >
              <a-select
                :style="{ maxWidth: 120 }"
                :options="NFTOptions"
                placeholder="Standard"
                v-model:value="formState.standard"
              >
              </a-select>
            </a-form-item>
            <div :style="{ textAlign: 'right' }">
              <a-button
                type="primary"
                :loading="data.loading"
                @click.prevent="transferNFT"
                >Transfer NFT</a-button
              >
            </div>
          </a-form>
        </a-col>
      </a-row>
      <a-descriptions
        title="Authenticate Identity Info"
        size="default"
        :column="1"
        v-if="isConnected"
      >
        <a-descriptions-item label="Principal ID">{{
          principal
        }}</a-descriptions-item>
        <!-- <a-descriptions-item label="Identity">{{activeProvider}}</a-descriptions-item>  -->
      </a-descriptions>
      <a-descriptions
        title="Authenticate Wallet Info"
        size="default"
        :column="1"
      >
        <a-descriptions-item label="Principal">
          {{ walletProvider?.wallets[0].principal }}
        </a-descriptions-item>
        <a-descriptions-item label="AccountId">
          {{ walletProvider?.wallets[0].accountId }}
        </a-descriptions-item>
      </a-descriptions>
    </div>
    <!-- </a-space> -->
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
.App {
  padding: 20px;
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
</style>
  