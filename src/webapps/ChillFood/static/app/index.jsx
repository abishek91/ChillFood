import React from 'react';
import {render} from 'react-dom';
import RecipeDetails from './recipeDetails.jsx'
import RecipeCreate from './recipeCreate.jsx'
import RecipeList from './home/recipeList.jsx'
import Followers from './followers.jsx'
import Following from './following.jsx'
import Profile from './profile.jsx'
import PartyList from './party/partyList.jsx'

// import App from './app.jsx'
import { Router, Route, hashHistory, Redirect } from 'react-router'

render((
  <Router history={hashHistory}>
    <Route path="/" component={RecipeList} />
    <Route path="/profile/:userId" component={Profile} />
    <Route path="/profile/:userId/followers" component={Followers} />
    <Route path="/profile/:userId/following" component={Following} />
    <Redirect from="x/:userId" to="profile/:userId" />
    <Route path="/recipe/create" component={RecipeCreate} />
    <Route path="/recipe/:recipeId" component={RecipeDetails} />
    <Route path="/party/list" component={PartyList} />
  </Router>
), document.getElementById('root'));