// Dependencies
var React = require('react');
var injectIntl = require('react-intl').injectIntl;
var FormattedMessage = require('react-intl').FormattedMessage;
var classNames = require('classnames');


var Login = React.createClass({
	onLogin: function(e) {
		e.preventDefault();
		this.props.onLogin(this.refs.username.value, this.refs.password.value);

	},
	render: function() {
		var _t = this.props.intl.formatMessage;
		var component;
		if(this.props.isAuthenticated) {
			return (<div/>);
		}
		return (
			<form key="login" className="form-login" action={this.props.action}>
				<div className="form-group">
					<input id="username" name="username" type="text" ref="username"
						placeholder={_t({ id: 'loginForm.placehoder.username'})} className="form-control" />
				</div>
				<div className="form-group" >
					<input id="password" name="password" type="password" ref="password"
						placeholder={_t({ id: 'loginForm.placehoder.password'})} className="form-control" />
				</div>
				<button type="submit"
						className="btn btn-primary action-login"
						onClick={this.onLogin}
						style={{width: 80, height: 33}}>
					<FormattedMessage id="loginForm.button.signin" />
				</button>
				<br/>
				<div className="login-errors">
					{
						this.props.errors?(<FormattedMessage id={"errors."+this.props.errors} />):(<div/>)
				}
			</div>
		</form>
		);
	}

});


var Logout = React.createClass({
	
	onLogout: function(e) {
		e.preventDefault();
		this.props.onLogout();
	},
	render: function() {
		var _t = this.props.intl.formatMessage;
		if(!this.props.isAuthenticated) {
			return (<div/>);
		}
		return (
			<a id="logout"
				className="logout"
				title={_t({id: "loginForm.button.signout"})}
				onClick={this.onLogout}
				type="submit">
					<i className={classNames("fa", "fa-md", "fa-sign-out", "white")} style={{marginLeft: 5}} />
				</a>
			);
		} 
});

Login = injectIntl(Login);
Logout = injectIntl(Logout);

module.exports = {
	Login,
	Logout
};
