var React = require('react/addons');

var TitleMixin = {
    contextTypes: {
        baseTitle: React.PropTypes.string
    }, 
    childContextTypes: {
        baseTitle: React.PropTypes.string
    },
    getChildContext: function() {
        return {
            baseTitle: this.context && this.context.baseTitle + (this.props.baseTitle || '')
        }
    },
    getTitle: function(title) {
        return this.context && this.context.baseTitle + (title || '');
    }
};

module.exports = TitleMixin;