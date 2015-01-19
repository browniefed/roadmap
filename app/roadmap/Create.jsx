var React = require('react/addons'),
    TitleMixin = require('../mixins/TitleMixin'),
    DocumentTitle = require('react-document-title'),
    Calendar = require('react-input-calendar'),
    ProjectSelector = require('roadmapper/components/ProjectSelector'),
    _ = require('lodash'),
    Fluxxor = require('fluxxor'),
    FluxMixin = Fluxxor.FluxMixin(React),
    StoreWatchMixin = Fluxxor.StoreWatchMixin,
    Router = require('react-router'),
    moment = require('moment'),
    NavigationMixin = Router.Navigation;

    var DATE_FORMAT = "MM-DD-YYYY";


var RoadmapCreate = React.createClass({
    mixins: [TitleMixin, FluxMixin, NavigationMixin, StoreWatchMixin('ProjectStore')],
    baseTitle: 'Create',
    getStateFromFlux: function() {
        return {
            projects: this.getFlux().store('ProjectStore').getProjects()
        }
    },
    componentWillMount: function() {
        this.getFlux().actions.ProjectActions.loadProjects();
    },
    getInitialState: function() {
        return {
            name: '',
            startDate: '',
            endDate: '',
            jamaApiId: ''
        };
    },
    handleChange: function(field, e) {
        this.setValue(field, _.isString(e) ? e : e.target.value);            
    },
    setValue: function(field, value) {
        var state = {};
        state[field] = value;
        this.setState(state);
    },
    handleCreate: function() {
        this.getFlux().actions.RoadmapActions.createRoadmap(this.state);
        this.transitionTo('roadmap-home');
    },
    getStartDate: function() {
        return this.state.startDate || moment().startOf('year').format('MM-DD-YYYY');
    },
    getEndDate: function() {
        return this.state.endDate || moment().endOf('year').format('MM-DD-YYYY');
    },
    render: function() {
        return (
            <DocumentTitle title={this.getTitle(this.baseTitle)}>
                <div className="roadmap-home">
                    <h2>Create a Roadmap</h2>
                    <div className="create-road-form">
                        <div className="create-road-input">
                            <label>
                                Roadmap Name
                                <input type="text" placeholder="Name" onChange={_.bind(this.handleChange, this, 'name')}/>
                            </label>
                        </div>
                        <div className="create-road-input">
                            <label>
                                Start Date
                                <Calendar format={DATE_FORMAT} computableFormat={DATE_FORMAT} date={this.getStartDate()} placeholder="Start Date" onChange={_.bind(this.handleChange, this, 'startDate')}/>
                            </label>
                        </div>
                        <div className="create-road-input">
                            <label>
                                End Date
                                <Calendar format={DATE_FORMAT} computableFormat={DATE_FORMAT} date={this.getEndDate()} placeholder="End Date" onChange={_.bind(this.handleChange, this, 'endDate')}></Calendar>
                            </label>
                        </div>
                        <div className="create-road-input">
                            <label>
                                Project
                                <ProjectSelector 
                                    value={this.state.jamaProjectId}
                                    onChange={_.bind(this.handleChange, this, 'jamaProjectId')} 
                                    options={this.state.projects}
                                ></ProjectSelector>
                            </label>
                        </div>
                        <div className="create-road-input">
                            <button onClick={this.handleCreate}>Create</button>
                        </div>
                    </div>
                </div>
            </DocumentTitle>
        )
    }
});

module.exports = RoadmapCreate;