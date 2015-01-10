var React = require('react/addons'),
    TitleMixin = require('../mixins/TitleMixin'),
    DocumentTitle = require('react-document-title');


var RoadmapCreate = React.createClass({
    mixins: [TitleMixin],
    baseTitle: 'Create',
    render: function() {
        return (
            <DocumentTitle title={this.getTitle(this.baseTitle)}>
                <div className="roadmap-home">
                    <div>
                        Create
                    </div>
                </div>
            </DocumentTitle>
        )
    }
});

module.exports = RoadmapCreate;