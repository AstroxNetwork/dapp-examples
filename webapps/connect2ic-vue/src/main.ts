import { createApp } from "vue"
import App from "./App.vue"
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
// import { inspect } from "@xstate/inspect"

// inspect({
//   iframe: false,
// })


createApp(App).use(Antd).mount("#root")
