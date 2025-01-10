const { version } = require('../../package.json');

const homeSSR = require(`../page/${version}/index.ssr.js`).page.default;

const renderHome = (props) => {
    return homeSSR(props);
};

const gameSSR = require(`../page/${version}/index.ssr.js`).page.default;
const renderGame = (props) => {
    return gameSSR(props);
};

module.exports = {
    renderHome,
    renderGame
}; 