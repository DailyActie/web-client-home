const React = require('react');
const { IntlProvider, FormattedMessage } = require('react-intl');
const { Link } = require('react-router');

const Header = require('./Header');
const Footer = require('./Footer');
const LoginPage = require('../sections/Login');

const { IMAGES, PNG_IMAGES, MAIN_MENU } = require('../../constants/HomeConstants');


function MainSidebar(props) {
  const { menuItems } = props;
  return (
    <aside className="main-sidebar">
      <ul className="main-menu-side">
        {
          menuItems.map(item =>  
            <li key={item.name} className="menu-item">
              <Link to={item.route}>
                {
                  item.image ? 
                    <div style={{ float: 'left', minWidth: 25 }}>
                      <img src={`${IMAGES}/${item.image}`} alt={item.name} />
                    </div>
                    : 
                    null
                }
                <FormattedMessage id={item.title} />
              </Link>
              {
                item.children && item.children.length ? 
                  <ul className="menu-group">
                    {
                      item.children.map((child, idx) =>
                        <li key={idx} className="menu-subitem">
                          <Link key={child.name} to={child.route}>
                            {
                              child.image ? 
                                <img src={`${IMAGES}/${child.image}`} alt={child.name} /> 
                                  : 
                                    null
                            }
                            <FormattedMessage id={child.title} />
                          </Link>
                        </li>
                        ) 
                    }
                  </ul>
                  : 
                    null
                }
            </li>
            )
        }
      </ul>
    </aside>
  );
} 

function Loader() {
  return (
    <div>
      <img 
        className="preloader" 
        src={`${PNG_IMAGES}/preloader-counterclock.png`} 
        alt="loading" 
      />
      <img 
        className="preloader-inner" 
        src={`${PNG_IMAGES}/preloader-clockwise.png`} 
        alt="loading" 
      />
    </div>
  );
}

const HomeRoot = React.createClass({
  componentWillMount: function () {
    const { init, ready } = this.props;
    init();
  },
  render: function () {
    const { ready, locale, loading, user, deviceCount, messages, 
      unreadNotifications, linkToNotification, login, logout, 
      setLocale, errors, dismissError, children } = this.props;

    if (!ready) {
      return <Loader />;
    }
    return (
      <IntlProvider 
        locale={locale.locale}
        messages={locale.messages} 
      >
        <div className="site-container">
          {
            loading ? <Loader /> : <div /> 
          }
          <Header
            firstname={user.profile.firstname}
            deviceCount={deviceCount}
            isAuthenticated={user.isAuthenticated}
            notifications={messages}
            unreadNotifications={unreadNotifications}
            linkToNotification={linkToNotification}
            locale={locale.locale}
            logout={logout} 
            setLocale={setLocale}
            errors={errors}
            dismissError={dismissError}
          />

          <div className="main-container">
            {
              user.isAuthenticated ? 
                <MainSidebar menuItems={MAIN_MENU} />
                :
                <MainSidebar menuItems={[]} />
            }
            {
              user.isAuthenticated ? 
                children
                :
                <LoginPage 
                  isAuthenticated={user.isAuthenticated}
                  errors={user.status.errors}
                  login={login}
                  logout={logout} 
                />
            }
          </div>
          <Footer />
        </div>
      </IntlProvider>
    );
  }
});

module.exports = HomeRoot;
