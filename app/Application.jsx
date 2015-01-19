var React = require("react/addons"),
    Router = require('react-router'),
    RouteHandler = Router.RouteHandler,
    Fluxxor = require('fluxxor'),
    FluxMixin = Fluxxor.FluxMixin(React),
    Flux = require('roadmapper/flux/Flux');
    
require('react-grid-layout/css/styles.css');
require('./sass/styles.scss');
require('roadmapper/components/select/default.css')

var Application = React.createClass({
    mixins: [FluxMixin],
    childContextTypes: {
        baseTitle: React.PropTypes.string
    },
    getDefaultProps: function() {
        return {
            flux: Flux
        }
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