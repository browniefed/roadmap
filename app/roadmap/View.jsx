var React = require('react/addons'),
    RoadmapPanel = require('./Panel'),
    ReactGridLayout = require('react-grid-layout'),
    lodash = require('lodash'),
    moment = require('moment'),
    DocumentTitle = require('react-document-title'),
    TitleMixin = require('../mixins/TitleMixin'),
    StateMixin = require('react-router').State,
    GridItem = require('roadmapper/GridItem'),
    FluxMixin = require('fluxxor').FluxMixin(React),
    StoreWatchMixin = require('fluxxor').StoreWatchMixin;

var rowHeight = 30,
    cols = 365;

var RoadmapView = React.createClass({
  mixins: [
            React.addons.PureRenderMixin, 
            TitleMixin, 
            StateMixin, 
            FluxMixin,
            StoreWatchMixin('RoadmapStore')
    ],

  getStateFromFlux: function() {
    return {
        roadmap: this.getFlux().store('RoadmapStore').getRoadmap(this.getParams().roadmapId)
    }
  },
  getDefaultProps: function() {
    return {
      className: "layout",
      rowHeight: rowHeight,
      cols: cols,
      margin: [1,1]
    };
  },

  getInitialState: function() {
    return {
        layout: []
    };
  },

  generateDOM: function() {
    var style = {
        width: '100%', 
        height: '100%', 
        backgroundColor: '#00B4FF'
    }
    return _.map(this.state.roadmap.items, function(item, key) {
      return (
            <div key={item.id}>
                <GridItem style={style}>
                    {item.fields.name}
                </GridItem>
            </div>
        );
    });
  },
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
    })
  },
  getGridLanes: function() {
    return _.map(this.getMonths(), function(month) {
        return (
            <div className="month-grid" />
        )
    })
  },
  onLayoutChange: function(layout) {
    if (!this.state.roadmap) {
        return;
    }

    this.state.roadmap.layout = layout;

    this.getFlux().actions.RoadmapActions.saveRoadmap({
        id: this.getParams().roadmapId,
        roadmap: this.state.roadmap
    });

    _.each(layout, function(layoutItem) {
        var jamaItem = this.getItemFromId(layoutItem.i);
        
        jamaItem.fields = _.omit(_.extend(jamaItem.fields, this.getDatesFromLayout(layoutItem,'$' + jamaItem.itemType)), 'progress$' + jamaItem.itemType);

        this.getFlux().actions.RoadmapActions.updateJamaItem({
            id: layoutItem.i,
            item: {
                fields: jamaItem.fields
            }
        })
    }, this)
  },
  getItemFromId: function(itemId) {
    return _.find(this.state.roadmap.items, function(item) {
        return item.id == itemId;
    })
  },
  getDatesFromLayout: function(layout, keyAppend) {
    var dates = {};
    dates['start_date' + keyAppend] = moment().startOf('year').add(layout.x, 'days').format('YYYY-MM-DD');
    dates['end_date' + keyAppend] = moment().startOf('year').add(layout.x + layout.w, 'days').format('YYYY-MM-DD');
    return dates;
  },
  getLayoutFromDate: function(start, end) {
    var mStart = moment(start),
        startDiff = moment().startOf('year').diff(mStart, 'days'),
        mEnd = momemt(end),
        endDiff = moment().startOf('year').diff(mEnd, days);

    return {
        x: startDiff,
        w: endDiff - startDiff
    }
  },
  handleDrag: function(layout, nextLayout) {
  },
  componentDidMount: function() {
    this.refs.grid.getDOMNode();
  },
  render: function() {
    return (
        <DocumentTitle title={this.getTitle(this.getParams().name)}>
            <div className="roadmap-view-wrap">
                <div className="grid">
                    <div className="grid-labels">
                        {this.getMonthLabels()}
                    </div>
                    <div className="grid-lanes">
                        {this.getGridLanes()}
                    </div>
                  <ReactGridLayout 
                    ref="grid"
                    layout={(this.state.roadmap && this.state.roadmap.layout) || this.state.layout} 
                    onLayoutChange={this.onLayoutChange}
                    onDrag={this.handleDrag}
                      {...this.props}>
                    {this.generateDOM()}
                  </ReactGridLayout>
                </div>
                <RoadmapPanel />
          </div>
      </DocumentTitle>
    );
  }
});

module.exports = RoadmapView;