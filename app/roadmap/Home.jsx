var React = require('react/addons'),
    Router = require('react-router'),
    Link = Router.Link,
    TitleMixin = require('../mixins/TitleMixin'),
    DocumentTitle = require('react-document-title');

var RoadmapHome = React.createClass({
    mixins: [TitleMixin],
    baseTitle: 'Home',
    render: function() {
        return (
            <DocumentTitle title={this.getTitle(this.baseTitle)}>
                <div className="roadmap-home">
                    <Link to="roadmap-view" params={{roadmapId: 1, name: 'Random Roadmap'}}>Random Roadmap</Link>
                </div>
            </DocumentTitle>
        )
    }
});

module.exports = RoadmapHome;