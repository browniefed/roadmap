var React = require('react/addons'),
    Router = require('react-router'),
    Link = Router.Link,
    TitleMixin = require('../mixins/TitleMixin'),
    DocumentTitle = require('react-document-title'),
    FluxMixin = require('fluxxor').FluxMixin(React),
    StoreWatchMixin = require('fluxxor').StoreWatchMixin,
    _ = require('lodash');

var RoadmapHome = React.createClass({
    mixins: [TitleMixin, FluxMixin, StoreWatchMixin('RoadmapStore')],
    baseTitle: 'Home',
    getStateFromFlux: function() {
        return {
            roadmaps: this.getFlux().store('RoadmapStore').getRoadmaps()
        };
    },
    getInitialState: function() {
        return {};
    },
    handleDeleteRoadmap: function(roadmapId) {
        this.getFlux().actions.RoadmapActions.deleteRoadmap({
            roadmapId: roadmapId
        })
    },
    getRoadmapLinks: function() {
        return _.map(this.state.roadmaps, function(roadmap, id) {
            return (
                <li>
                    <Link to="roadmap-view" params={{roadmapId: id, name: roadmap.name, roadmap: roadmap}}>{roadmap.name}</Link>
                    <button onClick={_.bind(this.handleDeleteRoadmap, this, id)}>X</button>
                </li>
            );
        }, this)

    },
    render: function() {
        return (
            <DocumentTitle title={this.getTitle(this.baseTitle)}>
                <div className="roadmap-home">
                    <div className="roadmap-home-header">
                        <h2 className="roadmap-home-title">Roadmaps</h2>
                        <Link className="roadmap-home-create" to="roadmap-create">+ Create Roadmap</Link>
                    </div>

                    <ul className="roadmap-home-list">
                        {this.getRoadmapLinks()}
                    </ul>
                </div>
            </DocumentTitle>
        )
    }
});

module.exports = RoadmapHome;