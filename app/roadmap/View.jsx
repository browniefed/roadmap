var React = require('react/addons'),
    JamaRoadmapWrap = require('./JamaWrap');

var View = React.createClass({
 
  render: function() {

    return (
        <div className="roadmap-view">
            <JamaRoadmapWrap />
        </div>
    );
  }
});

module.exports = View;