import React from 'react';
import ReactDOM from 'react-dom';
import App from './app';
import { getSsrProps } from '@utils/ssr';
import '@assets/css/common.less';

let container = null;

function mountReact() {
    container = document.querySelector('#root');
    if (!container) return;

    ReactDOM.hydrate(
		<App {...getSsrProps()}/>,
        document.querySelector('#root')
    );
}

mountReact();
