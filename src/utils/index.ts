import { ISystem } from 'typings/types';
/**
 * 获取当前系统信息
 */
export const getSystem = (): ISystem => {
	const ua = navigator.userAgent,
		isWindowsPhone = /(?:Windows Phone)/.test(ua),
		isSymbian = /(?:SymbianOS)/.test(ua) || isWindowsPhone,
		isAndroid = /(?:Android)/.test(ua),
		isFireFox = /(?:Firefox)/.test(ua),
		// isChrome = /(?:Chrome|CriOS)/.test(ua),
		isTablet = /(?:iPad|PlayBook)/.test(ua) || (isAndroid && !/(?:Mobile)/.test(ua)) || (isFireFox && /(?:Tablet)/.test(ua)),
		isPhone = /(?:iPhone)/.test(ua) && !isTablet;
	return {
		isTablet: isTablet,
		isPhone: isPhone,
		isAndroid: isAndroid,
		isPC: !isPhone && !isAndroid && !isSymbian && !isTablet
	};
}

/**
 * 获取当前浏览器信息
 */
export const getBrowser = (): string => {
	try {
		const list = navigator.userAgent.toLowerCase().match(/(msie|firefox|chrome|opera|version).*?([\d.]+)/);
		return list[1].replace(/version/, 'safari');
	} catch (e) {
		return '-';
	}
};

/**
 * 插入系统信息至body的attr
 */
export const insetSystemToBodyAttr = (system: ISystem): void => {
	let systemAttr: string = '';
	if (system.isPC) {
		systemAttr = 'pc';
	}
	if (system.isPhone || system.isAndroid) {
		systemAttr = 'mobile';
	}
	if (system.isTablet) {
		// systemAttr = 'tablet';
		systemAttr = 'pc';  // ipad使用与pc同样的样式
	}
	document.querySelector('body').setAttribute('system', systemAttr);
}

// 判断当前是否为横屏
export const isHorizontalScreen = () : boolean => {
	let angle:number = 0;
	if (window.screen && window.screen.orientation) {
		angle = window.screen.orientation.angle;
	} else {
		angle = window.orientation as number;
	}

	return angle === 90 || angle === -90;
}
