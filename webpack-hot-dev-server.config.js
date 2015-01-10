module.exports = require("./make-webpack-config")({
	hot: true,
	devServer: true,
	hotComponents: true,
	devtool: "eval-source-map",
	debug: true,
});
