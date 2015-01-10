var React = require('react/addons'),
    NavMain = require('../nav/Main'),
    DocumentTitle = require('react-document-title'),
    TitleMixin = require('../mixins/TitleMixin');

var Home = React.createClass({
    mixins: [TitleMixin],
    baseTitle: 'Home',
    render: function() {
        return (
            <DocumentTitle title={this.getTitle(this.baseTitle)}>
                <div className="home">
                    <NavMain />
                    <div>
                        Welcome home
                    </div>
                </div>
            </DocumentTitle>
        )
    }
});

module.exports = Home;