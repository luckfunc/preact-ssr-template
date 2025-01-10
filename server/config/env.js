const ENV = process.env.ENV;

const getHost = (env) => {
    const hosts = {
        test: 'http://test.api.com',
        prod: 'http://www.api.com',
        development: 'http://127.0.0.1:2028',
        qa: 'http://test.api.com',
        pro: 'http://www.api.com'
    };
    return hosts[env] || hosts.development;
};

module.exports = {
    ENV,
    getHost,
    isDev: ENV === 'development' || ENV === 'qa' || ENV === 'pro'
}; 