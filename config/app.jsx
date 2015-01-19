var AppRouter = require("../app/Router"),
    React = require('react/addons');

AppRouter.run(function (Handler) {
  React.render(<Handler/>, document.body);
});