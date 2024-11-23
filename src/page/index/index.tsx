/** @jsx h */
import { h } from 'preact';
import { hydrate } from 'preact/compat';
import App from './app';
import { getSsrProps } from '@utils/ssr';
import '@assets/css/common.less';

// // 使用 IIFE (立即执行函数) 来避免全局变量污染
(function() {
    const container = document.querySelector('#root');
    if (!container) return;

    hydrate(
        <App {...getSsrProps()}/>,
        container
    );
})();
