var React = require('react/addons'),
    Router = require('react-router'),
    Link = Router.Link;

var NavMain = React.createClass({
    render: function() {
        return (
            <div className="top-nav">
                <ul className="nav">
                    <li>
                        <Link to="home">Home</Link>
                    </li>
                    <li>
                        <Link to="roadmap">Roadmaps</Link>
                    </li>
                </ul>
                <Link to="roadmap-create" className="addRoadmap">+ New Roadmap</Link>
            </div>
        )
    }
});

module.exports = NavMain;