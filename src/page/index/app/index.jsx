import { h } from 'preact';
import './style.less';

export default function App() {
	return (
		<div onClick={() => {
			console.log('click');
		}}>
			ssr render success
		</div>
	);
}
