import React from 'react';
import {render} from 'react-dom';
import RecipeDetails from './recipeDetails.jsx'
import RecipeCreate from './recipe_create/recipeCreate.jsx'
import RecipeList from './home/recipeList.jsx'
import Followers from './followers.jsx'
import Following from './following.jsx'
import Profile from './profile.jsx'
import EditProfile from './profile/editProfile.jsx'
import PartyList from './party/partyList.jsx'

// import App from './app.jsx'
import { Router, Route, Redirect, hashHistory } from 'react-router'

render((
  <Router history={hashHistory}>
    <Route path="/" component={RecipeList} />
    <Route path="/profile/:userId" component={Profile} />
    <Route path="/profile/:userId/followers" component={Followers} />
    <Route path="/profile/:userId/following" component={Following} />
    <Redirect from="x/:userId" to="profile/:userId" />
    <Route path="/edit_profile" component={EditProfile} />
    <Route path="/recipe/create" component={RecipeCreate} />
    <Route path="/recipe/:recipeId" component={RecipeDetails} />
    <Route path="/party/list" component={PartyList} />
    <Redirect from="*" to="/" />
  </Router>
), document.getElementById('root'));