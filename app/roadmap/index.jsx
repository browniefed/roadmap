var React = require('react/addons'),
    Router = require('react-router'),
    RouteHandler = Router.RouteHandler,
    DocumentTitle = require('react-document-title'),
    TitleMixin = require('../mixins/TitleMixin');

var NavMain = require('../nav/Main');

var RoadmapIndex = React.createClass({
    mixins: [TitleMixin],
    getDefaultProps: function() {
        return {
            baseTitle: 'Roadmap - '
        }
    },
    render: function() {
        return (
            <div className="roadmap">
                <NavMain />
                <DocumentTitle>
                    <RouteHandler {...this.props} />
                </DocumentTitle>
            </div>
        )
    }
});

module.exports = RoadmapIndex;