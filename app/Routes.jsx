var React = require('react/addons'),
    Router = require('react-router'),
    Route = Router.Route,
    DefaultRoute = Router.DefaultRoute,
    App = require('./Application');


var Home = require('./home/Home'),
    Roadmap = require('./roadmap/index'),
    RoadmapHome = require('./roadmap/Home'),
    RoadmapView = require('./roadmap/View'),
    RoadmapCreate = require('./roadmap/Create');
    
var routes = (
    <Route name="app" path="/" handler={App}>
        <Route name="home" path="home" handler={Home} />
        <Route name="roadmap" path="roadmap" handler={Roadmap}>
            <Route name="roadmap-home" path="home" handler={RoadmapHome} />
            <Route name="roadmap-view" path="view/:roadmapId/:name" handler={RoadmapView} />
            <Route name="roadmap-create" path="create" handler={RoadmapCreate} />
            <DefaultRoute handler={RoadmapHome} />
        </Route>
        <DefaultRoute handler={Home} />
    </Route>
);



module.exports = routes;