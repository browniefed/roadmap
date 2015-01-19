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
                    {item.fields.name + ' - ' + item.id}
                </GridItem>
            </div>
        );
    });
  },
  getLayout: function() {
    var layout = (this.state.roadmap && this.state.roadmap.layout) || this.state.layout;
    if (!_.isEmpty(this.state.roadmap)) {
        layout = _.map(this.state.roadmap.items || [], function(item, index) {
            var layoutItem = this.getItemFromLayout(layout, item.id),
                itemType = item.itemType,
                startDate = item.fields['start_date$' + itemType],
                endDate = item.fields['end_date$' + itemType],
                startCoords = {};
                

            if (startDate && endDate) {
                startCoords = this.getLayoutFromDate(startDate, endDate);
            }

            return _.assign({
                i: item.id + '',
                y: index,
                w: 5,
                h: 5
            }, (layoutItem || {}), startCoords);

        }, this);
    }
    return layout;
  },
  getItemFromLayout: function(layout, id) {
    return _.find(layout, function(layoutItem) {
        return (layoutItem.id + '') == (id + '');
    })
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
        jamaItem.fields = _.extend(jamaItem.fields, this.getDatesFromLayout(layoutItem,'$' + jamaItem.itemType));

        this.getFlux().actions.RoadmapActions.updateJamaItem({
            id: layoutItem.i,
            roadmapId: this.getParams().roadmapId,
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
        startDiff = moment().startOf('year').diff(mStart, 'days') * -1,
        mEnd = moment(end),
        endDiff = moment().startOf('year').diff(mEnd, 'days') * -1;

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
  handleChange: function(e) {
    this.setState({
        jamaApiId: e.target.value
    })
  },
  loadItems: function(e) {
    if (e.key == 'Enter' && this.state.jamaApiId) {
        this.getFlux().actions.RoadmapActions.loadItemsForRoadmap({
            jamaApiId: this.state.jamaApiId,
            roadmapId: this.getParams().roadmapId
        });
        this.setState({
            jamaApiId: ''
        });

    }
  },
  resyncItems: function() {
    this.getFlux().actions.RoadmapActions.refreshItems({
        items: this.state.roadmap.items || [],
        roadmapId: this.getParams().roadmapId
    })
  },
  render: function() {
    return (
        <DocumentTitle title={this.getTitle(this.getParams().name)}>
            <div className="roadmap-view-wrap">
                <div className="roadmap-view-control">
                    <input 
                        type="text" 
                        value={this.state.jamaApiId} 
                        onChange={this.handleChange} 
                        onKeyDown={this.loadItems} 
                        placeholder="Jama API ID"/>

                    <button onClick={this.resyncItems}>Sync Items From Jama</button>

                </div>
                <div className="grid">
                    <div className="grid-labels">
                        {this.getMonthLabels()}
                    </div>
                    <div className="grid-lanes">
                        {this.getGridLanes()}
                    </div>
                  <ReactGridLayout 
                    ref="grid"
                    layout={this.getLayout()} 
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