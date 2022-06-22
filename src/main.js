import { createApp } from "vue";
// import Vue from 'vue';
import App from "./App.vue";
import router from "@/router";
import {userid,setUserId} from './utils/common.js';

// createApp(App).prototype.common.userid = userid;
// createApp(App).prototype.common.setUserId = setUserId;

const app = createApp(App);
app.config.globalProperties.$userid = userid;
app.use(router).mount("#app");
