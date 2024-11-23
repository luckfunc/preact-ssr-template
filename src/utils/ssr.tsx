import { h } from 'preact';
import renderToStaticMarkup from 'preact-render-to-string';
import { VERSION, BUILD_NAME } from '@constants';

/**
 * 获取ssr的html，只抽取了部分代码为公共代码，原因是：App组件各不相同，且外层布局可能会存在变更的情况
 * @param module
 * @param title: page title
 * @param content
 * @param props
 */
export const getSsrHtml = (module: string, title: string, content: string, props: any = {}) => {
	const propsScript = 'window.APP_PROPS = ' + JSON.stringify(props);
	let keywords = 'keywords';
	let description = `description`;

	// ssr服务端渲染需要使用到，正式环境中为空字符串
	const origin = process.env.ENTRY_ORIGIN;


	return renderToStaticMarkup(
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
					{ __html: content }
				} />
				<script dangerouslySetInnerHTML={
					{ __html: propsScript }
				}/>
				{
					// renderVConsole()
				}
				<script src={`${origin}/${BUILD_NAME}/${VERSION}/${module}.entry.js`}/>
			</body>
		</html>
	);
}

/**
 * 在客户端获取服务端渲染时所需要的数据
 */
export const getSsrProps = () => {
	return (window as any).APP_PROPS || {};
}
