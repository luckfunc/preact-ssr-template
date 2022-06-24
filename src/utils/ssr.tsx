import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { VERSION, BUILD_NAME } from '@constants';

/**
 * 获取ssr的html，只抽取了部分代码为公共代码，原因是：App组件各不相同，且外层布局可能会存在变更的情况
 * @param module
 * @param title: page title
 * @param content
 * @param props
 */
export const getSsrHtml = (module: string, title: string, content: string, props: any = {}) => {
	// 界面数据更新时需要React需要APP_PROPS来支持更新，比如: 响应式触发时布局的调整、图片大小的切换
	const propsScript = 'window.APP_PROPS = ' + JSON.stringify(props);
	let keywords = 'keywords';
	let description = `description`;

	// ssr服务端渲染需要使用到，正式环境中为空字符串
	const origin = process.env.ENTRY_ORIGIN;


	// 移动端console
	const renderVConsole = () => {
		return (
			<>
				<script src="https://cdn.bootcss.com/vConsole/3.11.2/vconsole.min.js"/>
				<script dangerouslySetInnerHTML={
					{__html: 'const vConsole = new VConsole({ maxLogNumber: 1000 });'}
				}/>
			</>
		);
	}

	return (
		ReactDOMServer.renderToStaticMarkup(
			<html lang="en">
			<head>
				<meta charSet="UTF-8"/>
				<title>{title}</title>
				<link rel="stylesheet" type="text/css" href={`${origin}/${BUILD_NAME}/${VERSION}/${module}.entry.css`}/>
				<link type="image/x-icon" href={`${origin}/${BUILD_NAME}/favicon.ico`} rel="shortcut icon"/>
				<link type="image/x-icon" href={`${origin}/${BUILD_NAME}/favicon.ico`} rel="icon"/>
				<meta content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" name="viewport"/>
				<meta name="keywords" content={keywords}/>
				<meta name="description" content={description}/>
				<meta name="google-site-verification" content="OlMueGMk6-1onaSMdJuqAYDjMJIhrvT_NaPrX6M9oos"/>
			</head>
			<body>
			<section id="root" className={`${module}-page`} dangerouslySetInnerHTML={
				{__html: content}
			} />
			<script dangerouslySetInnerHTML={
				{__html: propsScript}
			}/>
			{
				// renderVConsole()
			}

			<script src="https://cdn.bootcdn.net/ajax/libs/axios/0.27.2/axios.min.js"/>
			<script src="https://cdn.bootcdn.net/ajax/libs/react/18.2.0/umd/react.production.min.js"/>
			<script src="https://cdn.bootcdn.net/ajax/libs/react-dom/18.2.0/umd/react-dom.production.min.js"/>
			<script src="https://cdn.bootcdn.net/ajax/libs/classnames/2.3.1/index.min.js"/>
			<script src={`${origin}/${BUILD_NAME}/${VERSION}/${module}.entry.js`}/>
			</body>
			</html>
		)
	);
}

/**
 * 在客户端获取服务端渲染时所需要的数据
 */
export const getSsrProps = () => {
	return (window as any).APP_PROPS || {};
}
