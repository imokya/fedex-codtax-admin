import { createApp } from 'vue';
import ElementPlus from 'element-plus';
import zhCn from 'element-plus/es/locale/lang/zh-cn';
import { createPinia } from 'pinia';
import App from './App.vue';
import mitt from 'mitt';

import 'element-plus/dist/index.css';
import './styles/index.scss';

import router from '@/routers';
import installComponent from './install';
import 'virtual:svg-icons-register';

import './permission';

//全局属性
import installFilter from '@/filters';

const app = createApp(App);
const pinia = createPinia();
app.use(router);
app.use(pinia);
app.use(ElementPlus, {
  locale: zhCn,
});
installComponent(app);
installFilter(app);
app.provide('emitter', mitt());
app.mount('#app');
