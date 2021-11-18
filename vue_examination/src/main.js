// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";
import App from "./App";
import axios from "axios";
import { MyTip } from "./modules/mytip";
Vue.prototype.mytip = new MyTip();
// console.log(Vue.prototype.mytip);
const instance = axios.create({
  // baseURL: "http://localhost:3000/demo/examination",
  // baseURL: "120.25.249.159:3000/demo/examination",
  timeout: 10000
});
Vue.prototype.$axios = instance;
Vue.config.productionTip = false;
Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: "#app",
  components: { App },
  template: "<App/>"
});
