'use strict';

var React = require('react');

var _require = require('react-router'),
    Route = _require.Route,
    IndexRoute = _require.IndexRoute;

var requireAuth = require('./auth');

var HomeApp = require('../containers/HomeApp');
var Dashboard = require('../containers/DashboardData');
var History = require('../containers/HistoryData');
var Reports = require('../containers/ReportsData');
var Commons = require('../containers/CommonsData');
var Messages = require('../containers/MessageData');
var Settings = require('../containers/SettingsData');
var Profile = require('../components/sections/settings/Profile');
var Devices = require('../components/sections/settings/Devices');

var MembersSettings = require('../components/sections/settings/members/');
var MembersManage = require('../components/sections/settings/members/Edit');
var MembersCreate = require('../components/sections/settings/members/Create');

var CommonsSettings = require('../components/sections/settings/commons/');
var CommonsManage = require('../components/sections/settings/commons/Edit');
var CommonsCreate = require('../components/sections/settings/commons/Create');
var CommonsJoin = require('../components/sections/settings/commons/Join');

var Login = require('../containers/Login');
var LoginForm = require('../components/sections/login/LoginForm');
var PasswordReset = require('../components/sections/login/PasswordReset');
var PasswordResetRequest = require('../components/sections/login/PasswordResetRequest');

var routes = function routes() {
  return React.createElement(
    Route,
    { path: '/', component: HomeApp },
    React.createElement(IndexRoute, { 'default': 'dashboard', component: Dashboard, onEnter: requireAuth }),
    React.createElement(Route, { path: 'dashboard', component: Dashboard, onEnter: requireAuth }),
    React.createElement(Route, { path: 'history', component: History, onEnter: requireAuth }),
    React.createElement(Route, { path: 'notifications', component: Messages, onEnter: requireAuth }),
    React.createElement(Route, { path: 'reports', component: Reports, onEnter: requireAuth }),
    React.createElement(Route, { path: 'commons', component: Commons, onEnter: requireAuth }),
    React.createElement(
      Route,
      { path: 'settings', component: Settings, onEnter: requireAuth },
      React.createElement(IndexRoute, { 'default': 'profile', component: Profile }),
      React.createElement(Route, { path: 'profile', component: Profile }),
      React.createElement(
        Route,
        { path: 'members', component: MembersSettings },
        React.createElement(IndexRoute, { 'default': 'edit', component: MembersManage }),
        React.createElement(Route, { path: 'create', component: MembersCreate })
      ),
      React.createElement(Route, { path: 'devices', component: Devices }),
      React.createElement(
        Route,
        { path: 'commons', component: CommonsSettings },
        React.createElement(IndexRoute, { 'default': 'edit', component: CommonsManage }),
        React.createElement(Route, { path: 'create', component: CommonsCreate }),
        React.createElement(Route, { path: 'join', component: CommonsJoin })
      )
    ),
    React.createElement(
      Route,
      { path: 'login', component: Login },
      React.createElement(IndexRoute, { component: LoginForm }),
      React.createElement(Route, { path: '/password/reset/', component: PasswordResetRequest }),
      React.createElement(Route, { path: '/password/reset/:token', component: PasswordReset })
    )
  );
};

module.exports = routes;