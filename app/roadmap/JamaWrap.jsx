var React = require('react/addons'),
    RoadmapPanel = require('./Panel'),
    lodash = require('lodash'),
    moment = require('moment'),
    DocumentTitle = require('react-document-title'),
    TitleMixin = require('../mixins/TitleMixin'),
    StateMixin = require('react-router').State,
    NavigationMixin = require('react-router').Navigation,
    GridItem = require('roadmapper/GridItem'),
    GridLabel = require('roadmapper/GridLabel'),
    FluxMixin = require('fluxxor').FluxMixin(React),
    StoreWatchMixin = require('fluxxor').StoreWatchMixin,
    DateGridLayout = require('../components/DateGridLayout'),
    DateInterface = require('roadmapper/layout/DateInterface');


var rowHeight = 30,
    cols = 365,
    useLabelOffset = 15;

var RoadmapView = React.createClass({
  mixins: [
            TitleMixin, 
            StateMixin, 
            NavigationMixin,
            FluxMixin,
            StoreWatchMixin('RoadmapStore')
    ],

  getStateFromFlux: function() {
    return this.getFlux().store('RoadmapStore').getState(this.getParams().roadmapId)
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
  getLayout: function() {
    var layout = (this.state.roadmap && this.state.roadmap.layout) || this.state.layout;
    var groupLabels = this.getGroupingLabels(),
        labelOffset = 0;

    var colsWidth = cols;
    if (groupLabels) {
        labelOffset = useLabelOffset;
        colsWidth += labelOffset;
    }

    var labelLayouts = _.map(groupLabels, function(label, index) {
        return [{
            i: label.value + '_' + label.field,
            x: 0,
            y: ((index * 9) + 3),
            w: labelOffset,
            h: 9,
            maxW: labelOffset,
            isDraggable: false,
            isResizable: false
        },
        {
            i: label.value + '_' + label.field + '_swim',
            x: 0,
            y: ((index * 9) + 3) + (1),
            w: cols,
            h: 1,
            isDraggable: false,
            isResizable: false
        }]
    });


    if (!_.isEmpty(this.state.roadmap)) {
        layout = _.map(this.state.roadmap.items || [], function(item, index) {
            var layoutItem = this.getItemFromLayout(layout, item.id),
                itemType = item.itemType,
                startDate = item.fields['start_date$' + itemType],
                endDate = item.fields['end_date$' + itemType],
                startCoords = {},
                y = index,
                laneLabel,
                laneLabelIndex;
                

            if (startDate && endDate) {
                startCoords = this.getLayoutFromDate(startDate, endDate);
            }
            if (groupLabels) {
                laneLabel = _.find(groupLabels, function(label, index) {
                     if (item.fields[label.field] == label.value) {
                        laneLabelIndex = index;
                        return true;
                     }
                });

                if (laneLabel) {
                    y = ((laneLabelIndex  * 9) + 3);
                }
            }

            var lay = _.assign({
                i: item.id + '',
                y: y,
                w: 5,
                h: 3,
                minH: 3,
                maxH: 3,
            }, (layoutItem || {}), startCoords);
            lay.x += labelOffset;
            return lay;
        }, this);
    }


   _.each(labelLayouts, function(labelLayout) {
        layout = layout.concat(labelLayout || []);
   })

   return layout;
  },
  generateDOM: function() {
    var style = {
        width: '100%', 
        height: '100%', 
        backgroundColor: '#00B4FF',
        position: 'relative'
    };

    var labelStyle = {
        width: '100%', 
        height: '100%', 
        backgroundColor: '#CCC',
        position: 'relative',
        wordBreak: 'break-all'
    }

    var swimStyle = {
        width: '100%', 
        height: '100%', 
        backgroundColor: '#CCC',
        position: 'relative'
    }

    var groupLabels = this.getGroupingLabels();

    var items = _.map(this.state.roadmap.items, function(item, key) {
        var itemProgress = this.getProgressForItem(item);
      return (
            <div key={item.id}>
                <GridItem style={style} onClick={_.bind(this.showItemInPanel, this, item)}>
                    {this.getItemName(item, this.getSelectedGroupField())}
                    {this.getProgressBars(itemProgress)}
                </GridItem>
            </div>
        );
    }, this);

    var labels = _.map(groupLabels, function(label) {
        return (
            <div key={label.value + '_' + label.field}>
                <GridLabel style={labelStyle}>
                    {label.label}
                </GridLabel>
            </div>
        )
    });

    var swimLanes = _.map(groupLabels, function(label) {
        return (
            <div key={label.value + '_' + label.field + '_swim'}>
                <GridItem style={swimStyle}>
                </GridItem>
            </div>
        )
    });

    return items.concat(labels || []).concat(swimLanes || []);
  },
  showItemInPanel: function(item) {
    this.setState({
        selectedItem: item,
        selectedItemComments: []
    });
    this.getFlux().actions.RoadmapActions.loadCommentsForItem(item);
  },
  getGroupingLabels: function() {
    return this.extractLabelsFromItems(this.state.roadmap.items, this.getSelectedGroupField());
  },
  getItemName: function(item, groupedField) {
    var name = item.fields.name + ' - ' + item.id;

    if (groupedField && item.fields[groupedField]) {
        name += ' - ' + this.getGroupableFieldLabel(groupedField, item.fields[groupedField]);
    }

    return name;
  },
  getGroupableFieldLabel: function(groupedField, value) {
    var itemField = _.find(this.state.roadmap.itemTypes, function(field) {
        return groupedField == field.name;
    }),
    value;

    if (itemField.fieldType === "LOOKUP") {
        value = _.find(this.state.roadmap.pickListOptions[itemField.name].options, function(options) {
            return options.id == value;
        });
        value = (value && value.name) || '';
    } else {
        value = _.find(this.state.roadmap.releases, function(release) {
            return release.id == value;
        });
        value = (value && value.name) || '';

    }

    return value;
  },
  extractLabelsFromItems: function(items, groupedField) {
    if (!groupedField) {
        return null;
    }

    var labels = _.map(items, function(item) {
        var value = item.fields[groupedField],
            label = this.getGroupableFieldLabel(groupedField, value);

        return {
            value: value,
            label: label,
            field: groupedField
        }
    }, this);

    return _.uniq(labels, function(label) {
        return label.value;
    })
  },
  getProgressBars: function(progressItems) {
    if (_.isEmpty(progressItems)) {
        return null;
    }

    var height = (100/progressItems.length ) + '%';
    var progressBars = _.map(progressItems, function(progressPercent) {
        var style = {
            height: height,
            width: progressPercent
        }
        return (
            <div className="progress-bar" style={style} />
        )
    })
  

    return (
        <div className="progress-bars">
            {progressBars}
        </div>
    )
   },


  getProgressForItem: function(item) {
    var itemProgress;
    if (!_.isEmpty(this.state.roadmap.progressFields)) {
        itemProgress = _.filter(_.map(this.state.roadmap.progressFields, function(progressField) {
            return item.fields[progressField.name];
        }), function(progress) {
            return progress;
        });
    }
    return itemProgress;
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
    
    var groupLabels = this.getGroupingLabels(),
        offset = 0;

    if (groupLabels) {
        offset = useLabelOffset;
    }

    _.each(layout, function(layoutItem) {
        var jamaItem = this.getItemFromId(layoutItem.i);
        if (!jamaItem) {
            return;
        }
        var progressFields = _.pluck(this.state.roadmap.progressFields, 'name');


        jamaItem.fields = _.extend(jamaItem.fields, this.getDatesFromLayout(layoutItem,'$' + jamaItem.itemType, offset));

        this.getFlux().actions.RoadmapActions.updateJamaItem({
            id: layoutItem.i,
            roadmapId: this.getParams().roadmapId,
            item: {
                fields: jamaItem.fields
            },
            removeFields: progressFields
        })
    }, this)
  },
  getItemFromId: function(itemId) {
    return _.find(this.state.roadmap.items, function(item) {
        return item.id == itemId;
    })
  },
  getDatesFromLayout: function(layoutItem, keyAppend, offset) {
    return DateInterface.datesFromLayoutItem({
        start: moment().startOf('year'),
        layoutItem: layoutItem,
        fields: {
            start: 'start_date' + keyAppend,
            end: 'end_date' + keyAppend
        },
        format: 'YYYY-MM-DD',
        offset: offset
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
  handleGroupChange: function(e) {
    var query = this.getQuery(),
        newQuery = {};
    if (!query.groupBy) {
        newQuery.groupBy = e.target.value;
    }
    this.transitionTo(this.makePath(this.getPathname(), {}, newQuery));
  },
  getSelectedGroupField: function() {
    return this.getQuery().groupBy;
  },
  getGroupableElements: function() {
    var options = _.map(this.state.roadmap.groupableFields, function(field) {
        return (
            <option value={field.name}>{field.label}</option>
        );
    });

    options.unshift(<option value="">No Grouping</option>);

    return (
        <select onChange={this.handleGroupChange} value={this.getSelectedGroupField() || ''}>
            {options}
        </select>
    );

  },
  handleAddComment: function(text) {
    console.log(text);
  },

  getReleaseLines: function() {
    var groupLabels = this.getGroupingLabels();

    if (groupLabels) {
        var releaseDates = this.getReleases(this.state.roadmap.releases, _.pluck(groupLabels, 'value'));
    }
  },
  getReleases: function(releases, releaseValues) {
    return _.filter(releases, function(release) {
        return _.contains(releaseValues, release.id);
    });
  },
  render: function() {
    var groupLabels = this.getGroupingLabels();

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
                    {this.getGroupableElements()}
                </div>
                <DateGridLayout
                    {...this.props}
                    layout={this.getLayout()}
                    onDrag={this.handleDrag()}
                    onLayoutChange={this.handleLayoutChange}
                    offset={groupLabels ? 71 : 0}
                    addLines={this.getReleaseLines()}
                >
                    {this.generateDOM()}
                </DateGridLayout>
                <RoadmapPanel 
                    item={this.state.selectedItem} 
                    comments={this.state.selectedItemComments}
                    onAddComment={this.handleAddComment}/>
          </div>
      </DocumentTitle>
    );
  }
});

module.exports = RoadmapView;