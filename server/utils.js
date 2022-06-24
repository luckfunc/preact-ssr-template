
// 写日志
const appendLog = (key, err) => {
	if (err.config) {
		console.error(`============${new Date().toLocaleString()}===========`);
		console.error(`${key} [${err.config.method}]: ${err.config.url}`);
		console.error(`request: {params: ${JSON.stringify(err.config.params)}, data: ${JSON.stringify(err.config.data)}}`);
		console.error(`response: ${JSON.stringify(err.response)}`);
	} else {
		console.error(`============${new Date().toLocaleString()}===========`);
		console.error(`${key} javascript error: ${err}(ssr render)`);
		console.error(`response: ${JSON.stringify(err.response)}`);
	}
};

// 获取系统信息
const getSystem = (userAgent) => {
	// 调试时获取到的数据:
	// 'user-agent': 'Mozilla/5.0 (Linux; Android 8.0.0; SM-G955U Build/R16NW) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.141 Mobile Safari/537.36'
	// 'user-agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 10_3_1 like Mac OS X) AppleWebKit/603.1.30 (KHTML, like Gecko) Version/10.0 Mobile/14E304 Safari/602.1',
	//	'user-agent': 'Mozilla/5.0 (iPad; CPU OS 13_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/87.0.4280.77 Mobile/15E148 Safari/604.1',
	// 'user-agent': 'Mozilla/5.0 (iPad; CPU OS 13_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/87.0.4280.77 Mobile/15E148 Safari/604.1',
	// 'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.83 Safari/537.36',
	const ua = userAgent;
	const isWindowsPhone = /(?:Windows Phone)/.test(ua);
	const isSymbian = /(?:SymbianOS)/.test(ua) || isWindowsPhone;
	const isAndroid = /(?:Android)/.test(ua);
	const isFireFox = /(?:Firefox)/.test(ua);
	const isTablet = /(?:iPad|PlayBook)/.test(ua) || (isAndroid && !/(?:Mobile)/.test(ua)) || (isFireFox && /(?:Tablet)/.test(ua));
	const isPhone = /(?:iPhone)/.test(ua) && !isTablet;
	return {
		isTablet: isTablet,
		isPhone: isPhone,
		isAndroid: isAndroid,
		isPC: !isPhone && !isAndroid && !isSymbian && !isTablet
	};
}

module.exports = {
	appendLog,
	getSystem
}
