var React = require("react/addons"),
    Router = require('react-router'),
    RouteHandler = Router.RouteHandler;
    
require('react-grid-layout/css/styles.css');
require('./sass/styles.scss');

var Application = React.createClass({
    childContextTypes: {
        baseTitle: React.PropTypes.string
    },
    getChildContext: function() {
        return {
            baseTitle: 'Jama - '
        }
    },
	render: function() {
		return (
            <div className="application">
                <RouteHandler/>
            </div>
      );
	}
});

module.exports = Application;