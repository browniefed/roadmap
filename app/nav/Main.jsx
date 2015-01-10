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
                    <li>
                        <Link to="roadmap-create">New Roadmap</Link>
                    </li>
                </ul>
            </div>
        )
    }
});

module.exports = NavMain;