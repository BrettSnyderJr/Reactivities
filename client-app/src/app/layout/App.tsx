import React, { useEffect } from 'react';
import { Container } from 'semantic-ui-react';
import NavBar from './NavBar';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import { observer } from 'mobx-react-lite';
import { Route, Switch } from 'react-router';
import HomePage from '../../features/home/HomePage';
import ActivityForm from '../../features/activities/form/ActivityForm';
import ActivityDetails from '../../features/activities/details/ActivityDetails';
import { useLocation } from 'react-router-dom';
import TestErrors from '../../features/errors/TestErrors';
import { ToastContainer } from 'react-toastify';
import NotFound from '../../features/errors/NotFound';
import ServerError from '../../features/errors/ServerError';
//import LoginForm from '../../features/users/LoginForm';
import { useStore } from '../stores/store';
import LoadingComponent from './LoadingComponent';
import ModalContainer from '../common/modals/ModalContainer';
import ProfilePage from '../../features/profiles/ProfilePage';
import PrivateRoute from './PrivateRoute';

const App = function () {
  
  const location = useLocation();
  const { commonStore, userStore } = useStore();

  useEffect(() => {
    
    if (commonStore.token) {
      userStore.getUser().finally(() => commonStore.setAppLoaded());
    } else {
      commonStore.setAppLoaded();
    }
  }, [commonStore, userStore]);

  if (!commonStore.appLoaded) return <LoadingComponent content='Loading App...' />;

  return (
    <>
      <ToastContainer position='bottom-right' hideProgressBar autoClose={1500} />
      <ModalContainer />

      <Route exact path='/' component={HomePage} />

      <Route path={'/(.+)'} render={() => {
          return(
            <>
              <NavBar />
              <Container style={{ marginTop: '7em' }}>
                <Switch>
                  <PrivateRoute exact path='/activities' component={ActivityDashboard} />
                  <PrivateRoute path='/activities/:id' component={ActivityDetails} />
                  <PrivateRoute key={location.key} path={['/activity/create', '/activity/manage/:id']} component={ActivityForm} />
                  <PrivateRoute path='/profiles/:username' component={ProfilePage} />
                  <PrivateRoute path='/errors' component={TestErrors} />
                  <Route path='/server-error' component={ServerError} />
                  {/* <Route path='/login' component={LoginForm} /> */}
                  <Route component={NotFound} />
                </Switch>
              </Container>
            </>
          )
        }}
      />
    </>
  );
}

export default observer(App);
