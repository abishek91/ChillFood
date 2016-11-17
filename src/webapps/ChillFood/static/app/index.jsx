import React from 'react';
import {render} from 'react-dom';
import RecipeList from './home/recipeList.jsx'
import RecipeDetails from './recipeDetails.jsx'
import RecipeCreate from './recipeCreate.jsx'
import { Router, Route, hashHistory, browserHistory } from 'react-router'

render((<Router history={hashHistory}>
            <Route path="/" component={RecipeList} />
            <Route path="/recipe/create" component={RecipeCreate} />
            <Route path="/recipe/:recipeId" component={RecipeDetails} />

          </Router>), document.getElementById('root'));

// <RecipeList search={this.state.search} />
