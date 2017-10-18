import { connectedRouterRedirect } from 'redux-auth-wrapper/history4/redirect'
import locationHelperBuilder from 'redux-auth-wrapper/history4/locationHelper'


const locationHelper = locationHelperBuilder({})

export const userIsAuthenticated = connectedRouterRedirect({
  redirectPath: '/signin',
  authenticatedSelector: state => !!state.getIn(['auth', 'signedIn'], false),
  wrapperDisplayName: 'UserIsAuthenticated'
})

export const userIsNotAuthenticated = connectedRouterRedirect({
  redirectPath: (state, ownProps) => 
    locationHelper.getRedirectQueryParam(ownProps) || '/',
  allowRedirectBack: false,
  authenticatedSelector: state => !state.getIn(['auth', 'signedIn'], false),
  wrapperDisplayName: 'UserIsNotAuthenticated'
})

export const userIsAdmin = connectedRouterRedirect({
  redirectPath: '/',
  authenticatedSelector: state => (
    !state.getIn(['auth', 'userLoaded'], false) ||
    (state.getIn(['auth', 'signedIn'], false) && state.getIn(['auth', 'currentUser', 'is_staff'], false))
  ),
  wrapperDisplayName: 'UserIsAdmin'
})