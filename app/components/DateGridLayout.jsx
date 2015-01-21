var ReactGridLayout = require('react-grid-layout'),
    React = require('react'),
    moment = require('moment'),
    _ = require('lodash');


var DateGridLayout = React.createClass({
    getYear: function() {
        return moment().startOf('year').format('YYYY');
    },
    getMonths: function() {
        return moment.months();
    },
    getMonthLabels: function() {
        return _.map(this.getMonths(), function(month) {
            return (
                <div className="month-label">
                    {month}
                </div>
            )
        });
    },
    getGridLanes: function() {
        return _.map(this.getMonths(), function(month) {
            return (
                <div className="month-grid" />
            )
        });
    },
    getOffset: function() {
        return {
            'paddingLeft': this.props.offset + 'px'
        }
    },
    render: function() {
        return (
            <div className="grid">
                <div className="grid-labels" style={this.getOffset()}>
                    {this.getMonthLabels()}
                </div>
                <div className="grid-lanes" style={this.getOffset()}>
                    {this.getGridLanes()}
                </div>
                <ReactGridLayout 
                    {...this.props}
                    layout={this.props.layout} 
                >
                    {this.props.children}
                </ReactGridLayout>
            </div>
        );
    }
});

module.exports = DateGridLayout;