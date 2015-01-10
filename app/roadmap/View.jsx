var React = require('react/addons'),
    ReactGridLayout = require('react-grid-layout'),
    lodash = require('lodash'),
    moment = require('moment'),
    DocumentTitle = require('react-document-title'),
    TitleMixin = require('../mixins/TitleMixin'),
    StateMixin = require('react-router').State;

var rowHeight = 30,
    cols = 365;

var RoadmapView = React.createClass({
  mixins: [React.addons.PureRenderMixin, TitleMixin, StateMixin],

  getDefaultProps() {
    return {
      className: "layout",
      items: 20,
      rowHeight: rowHeight,
      cols: cols,
      isCompactable: false,
      margin: [1,1]
    };
  },

  getInitialState() {
    var layout = this.generateLayout();
    return {
      layout: layout
    };
  },

  generateDOM() {
    return _.map(_.range(this.props.items), function(i) {
      return (<div key={i}><span className="text">{i}</span></div>);
    });
  },

  generateLayout() {
    var p = this.props;
    return _.map(new Array(p.items), function(item, i) {
      var y = _.result(p, 'y') || Math.ceil(Math.random() * 4) + 1;
      return {x: i * 2 % 12, y: Math.floor(i / 6) * y, w: 20, h: y, i: i};
    });
  },
  getYear() {
    return moment().startOf('year').format('YYYY');
  },
  getMonths() {
    return moment.months();
  },
  getMonthLabels() {
    return _.map(this.getMonths(), function(month) {
        return (
            <div className="month-label">
                {month}
            </div>
        )
    })
  },
  getGridLanes() {
    return _.map(this.getMonths(), function(month) {
        return (
            <div className="month-grid" />
        )
    })
  },
  onLayoutChange: function(layout) {
    
  },
  handleDrag: function(layout, nextLayout) {
    console.log(layout);
  },
  componentDidMount: function() {
    this.refs.grid.getDOMNode();
  },
  render() {
    debugger;
    return (
        <DocumentTitle title={this.getTitle(this.getParams().name)}>
            <div>
                <div className="grid">
                    <div className="grid-labels">
                        {this.getMonthLabels()}
                    </div>
                    <div className="grid-lanes">
                        {this.getGridLanes()}
                    </div>
                  <ReactGridLayout 
                    ref="grid"
                    layout={this.state.layout} 
                    onLayoutChange={this.onLayoutChange}
                    onDrag={this.handleDrag}
                      {...this.props}>
                    {this.generateDOM()}
                  </ReactGridLayout>
                </div>
          </div>
      </DocumentTitle>
    );
  }
});

module.exports = RoadmapView;