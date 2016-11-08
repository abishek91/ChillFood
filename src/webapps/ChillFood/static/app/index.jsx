import React from 'react';
import {render} from 'react-dom';
import RecipeDetails from './recipeDetails.jsx'
import RecipeCreate from './recipeCreate.jsx'
import { Router, Route, hashHistory } from 'react-router'

render((
  <Router history={hashHistory}>
    <Route path="/" component={RecipeDetails} />
    <Route path="/recipe" component={RecipeDetails} />
    <Route path="/recipe/create" component={RecipeCreate} />
  </Router>
), document.getElementById('root'));