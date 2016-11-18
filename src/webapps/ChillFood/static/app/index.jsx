import React from 'react';
import {render} from 'react-dom';
import RecipeDetails from './recipeDetails.jsx'
import RecipeCreate from './recipeCreate.jsx'
import RecipeList from './home/recipeList.jsx'
import Followers from './followers.jsx'
import Profile from './profile.jsx'
import App from './app.jsx'
import { Router, Route, hashHistory } from 'react-router'

render((
  <Router history={hashHistory}>
    <Route path="/" component={RecipeList} />
    <Route path="/profile/:userId" component={Profile} />
    <Route path="/recipe/create" component={RecipeCreate} />
    <Route path="/recipe/:recipeId" component={RecipeDetails} />
  </Router>
), document.getElementById('root'));