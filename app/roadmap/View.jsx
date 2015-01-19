var React = require('react/addons'),
    RoadmapPanel = require('./Panel'),
    lodash = require('lodash'),
    moment = require('moment'),
    DocumentTitle = require('react-document-title'),
    TitleMixin = require('../mixins/TitleMixin'),
    StateMixin = require('react-router').State,
    GridItem = require('roadmapper/GridItem'),
    FluxMixin = require('fluxxor').FluxMixin(React),
    StoreWatchMixin = require('fluxxor').StoreWatchMixin,
    DateGridLayout = require('../components/DateGridLayout'),
    DateInterface = require('roadmapper/layout/DateInterface');


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
    debugger;
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
                h: 3,
                minH: 3,
                maxH: 3,
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

  handleLayoutChange: function(layout) {
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
  getDatesFromLayout: function(layoutItem, keyAppend) {
    return DateInterface.datesFromLayoutItem({
        start: moment().startOf('year'),
        layoutItem: layoutItem,
        fields: {
            start: 'start_date' + keyAppend,
            end: 'end_date' + keyAppend
        },
        format: 'YYYY-MM-DD'
    });
  },
  getLayoutFromDate: function(start, end) {
    var scale = {
        start: moment().startOf('year'),
        end: moment().startOf('year')
    };

    return DateInterface.dateToLayoutFields(scale, start, end);
  },
  handleDrag: function(layout, nextLayout) {

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
                <DateGridLayout
                    {...this.props}
                    layout={this.getLayout()}
                    onDrag={this.handleDrag()}
                    onLayoutChange={this.handleLayoutChange}
                >
                    {this.generateDOM()}
                </DateGridLayout>
                <RoadmapPanel />
          </div>
      </DocumentTitle>
    );
  }
});

module.exports = RoadmapView;