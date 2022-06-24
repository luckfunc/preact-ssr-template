import React from 'react';
import ReactDOMServer from 'react-dom/server';
import App from './app';
import { getSsrHtml } from '@utils/ssr';

interface IProps {
}
export default function SSR(props: IProps) {
	const content = ReactDOMServer.renderToString(
		<App {...props}/>
	);

	return getSsrHtml('index', 'SSR', content, props);
}
