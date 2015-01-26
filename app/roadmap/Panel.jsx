var React = require('react/addons'),
    _ = require('lodash');

var RoadmapPanel = React.createClass({
    getDefaultProps: function() {
        return {
            item: null,
            comments: []
        }
    },
    getItemDisplayInfo: function() {
        if (!this.props.item) {
            return null;
        }

        return _.map(this.props.item.fields, function(value, key) {
            return (
                <div>
                    {key} : {value}
                </div>
            )
        });

    },
    getCommentsToDisplay: function() {
        return _.map(this.props.comments, function(comment) {
            return (
                <div style={{marginTop: '5px'}}>
                    <div>Comment By: {comment.createdBy}</div>
                    <div>Posted at : {comment.createdDate}</div>
                    <div dangerouslySetInnerHTML={{__html: comment.body.text}} />
                </div>
            )
        })
    },
    render: function() {
        return (
            <div className="roadmap-view-panel">
                <h2>Panel</h2>
                <div>
                    {this.getItemDisplayInfo()}
                </div>
                <div style={{marginTop: '10px'}}>
                    {this.getCommentsToDisplay()}
                </div>
            </div>
        )
    }
});

module.exports = RoadmapPanel;