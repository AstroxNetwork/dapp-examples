<script setup lang="ts">
import logo from "./assets/dfinity.svg"
/*
 * Connect2ic provides essential utilities for IC app development
 */
import { createClient } from "@connect2ic/core"
import { defaultProviders } from "@connect2ic/core/providers"
import "@connect2ic/core/style.css"
import Example from "./component/example.vue"

const client = createClient({
  providers: defaultProviders,
  globalProviderConfig: {},
})
</script>

<template>
  <Connect2ICProvider :client="client">
    <Example />
  </Connect2ICProvider>
</template>

<style>

</style>
