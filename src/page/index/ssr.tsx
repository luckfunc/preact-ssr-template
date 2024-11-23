import { h } from 'preact';
import renderToString from 'preact-render-to-string';
import App from './app';
import { getSsrHtml } from '@utils/ssr';

interface IProps {
}
export default function SSR(props: IProps) {
	const content = renderToString(
		<App {...props}/>
	);

	return getSsrHtml('index', 'SSR', content, props);
}
