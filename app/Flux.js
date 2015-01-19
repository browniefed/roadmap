var Fluxxor = require('fluxxor');

var RoadmapStore = require('roadmapper/flux/roadmap/RoadmapStore'),
    RoadmapActions = require('roadmappper/flux/roadmap/RoadmapActions');

var ProjectStore = require('roadmapper/flux/project/ProjectStore'),
    ProjectActions = require('roadmappper/flux/project/ProjectActions');


    var stores = {
        RoadmapStore: new RoadmapStore(),
        ProjectStore: new ProjectStore()
    }
    var actions = {
        RoadmapActions: RoadmapActions,
        ProjectActions: ProjectActions
    }

module.exports = new Fluxxor.Flux(stores, actions);
