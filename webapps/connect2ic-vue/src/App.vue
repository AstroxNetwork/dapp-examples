<script setup lang="ts">
import logo from "./assets/dfinity.svg"
/*
 * Connect2ic provides essential utilities for IC app development
 */
import { Connect2ICProvider } from "@connect2ic/vue"
import { createClient } from "@connect2ic/core"
import {
  AstroX,
  defaultProviders,
  ICX,
  PlugWallet,
} from "@connect2ic/core/providers"
import "@connect2ic/core/style.css"
import Example from "./component/example.vue"
import VConsole from "vconsole"

const vConsole = new VConsole()

const client = createClient({
  // providers: defaultProviders,
  providers: [
    (window as any).icx
      ? new ICX({
          // providerUrl: "https://ccmhe-vqaaa-aaaai-acmoq-cai.raw.ic0.app/",
          // providerUrl: "http://localhost:8080/",
        })
      : new AstroX({
          providerUrl: "https://ccmhe-vqaaa-aaaai-acmoq-cai.raw.ic0.app/",
          // providerUrl: "http://localhost:3000/",
          // delegationModes: ["global"],
        }),
    new PlugWallet(),
  ],
  globalProviderConfig: {
    dev: true,
  },
})
</script>

<template>
  <Connect2ICProvider :client="client">
    <Example />
  </Connect2ICProvider>
</template>

<style>
</style>
